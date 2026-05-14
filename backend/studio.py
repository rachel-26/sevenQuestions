from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import asyncio
import json
import os
from enum import Enum

app = FastAPI(title="ScriptureOS Analysis Engine")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Configuration ==========
class ModelProvider(str, Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    MOCK = "mock"

# Configure which provider to use (set via environment variable)
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "ollama")  # ollama, openai, mock
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")  # or mistral, llama2, etc.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

# ========== Request/Response Models ==========
class AnalyzeRequest(BaseModel):
    book: str
    chapter: int
    verse: int
    text: str
    context: Optional[str] = None  # Surrounding verses for better analysis

class AnalyzeResponse(BaseModel):
    who: List[str]
    why: str
    when: str
    where: List[str]
    what: List[str]
    how_many: Optional[int]
    how: str
    actions: List[str]
    repetitions: List[str]
    raw_response: Optional[Dict] = None  # For debugging

# ========== Prompt Engineering ==========
def build_analysis_prompt(request: AnalyzeRequest) -> str:
    """Build a structured prompt for the LLM using the missionary's framework"""
    
    context_section = ""
    if request.context:
        context_section = f"\nContext (surrounding verses):\n{request.context}\n"
    
    return f"""You are analyzing a Bible verse using a rigorous 7-question missionary framework. 
Extract EXACTLY what the text says. Do not add theological interpretation unless explicitly stated in the verse.

Reference: {request.book} {request.chapter}:{request.verse}
Verse text: "{request.text}"
{context_section}

Analyze this verse and answer with a JSON object containing EXACTLY these fields:

1. "who": List of specific people, characters, or entities mentioned (e.g., ["God", "Moses", "the people"])
2. "why": The purpose or reason stated in this verse (use "not specified" if absent)
3. "when": Time indicators (e.g., "in the morning", "the third day", "after the flood")
4. "where": Specific locations (e.g., ["Mount Sinai", "the wilderness", "Jerusalem"])
5. "what": Specific objects, actions, choices, or alternatives mentioned (e.g., ["the bronze serpent", "the left hand"])
6. "how_many": Number as integer (0 if none, extract even implied numbers like "seven" → 7)
7. "how": The manner or method described (verbs with their manner e.g., "boldly spoke", "ran quickly")
8. "actions": All action verbs in the verse as a list (e.g., ["said", "went", "commanded"])
9. "repetitions": Words or phrases repeated in this verse (list repeated words, ignore common stop words)

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no extra text.

Example response format:
{{
  "who": ["God", "Abraham"],
  "why": "to test Abraham's faith",
  "when": "after these events",
  "where": ["Moriah"],
  "what": ["his son Isaac"],
  "how_many": 1,
  "how": "with urgency and obedience",
  "actions": ["said", "take", "offer"],
  "repetitions": ["only son"]
}}

Now analyze {request.book} {request.chapter}:{request.verse}:
"""

# ========== LLM Providers ==========
async def call_ollama(prompt: str) -> Dict[str, Any]:
    """Call local Ollama model"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"  # Force JSON output if model supports it
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Ollama service error")
        
        result = response.json()
        # Parse the response (might be string or already dict)
        if isinstance(result.get("response"), str):
            try:
                return json.loads(result["response"])
            except json.JSONDecodeError:
                # Fallback: try to extract JSON from text
                import re
                json_match = re.search(r'\{.*\}', result["response"], re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                raise
        return result

async def call_openai(prompt: str) -> Dict[str, Any]:
    """Call OpenAI API"""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a Bible analysis engine. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "response_format": {"type": "json_object"}
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="OpenAI API error")
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        return json.loads(content)

async def call_local_rules(request: AnalyzeRequest) -> Dict[str, Any]:
    """Rule-based fallback when no LLM is available - does real text analysis"""
    verse_text = request.text.lower()
    words = verse_text.split()
    
    # Extract named entities using simple heuristics
    import re
    
    # Find capitalized words (potential names/places)
    capitalized = re.findall(r'\b([A-Z][a-z]+)\b', request.text)
    
    time_matches = re.findall(r'\b(day|night|morning|evening|week|month|year|\d+th|\w+ day)\b', verse_text)
    
    # Count repetitions
    from collections import Counter
    word_counts = Counter([w.strip('.,!?;:') for w in words if len(w) > 2])
    repetitions = [word for word, count in word_counts.items() if count >= 2 and word not in ['the', 'and', 'for', 'but', 'so', 'then']]
    
    # Extract numbers
    numbers = re.findall(r'\b(\d+)\b', verse_text)
    number_words = re.findall(r'\b(one|two|three|four|five|six|seven|eight|nine|ten)\b', verse_text)
    how_many = int(numbers[0]) if numbers else (len(number_words) if number_words else 0)
    
    # Extract actions (verbs - approximate by looking for common verb endings)
    common_verbs = ['said', 'went', 'came', 'saw', 'heard', 'spoke', 'walked', 'ran', 'stood', 'sat', 'ate', 'drank', 
                    'gave', 'took', 'made', 'built', 'destroyed', 'blessed', 'cursed', 'loved', 'hated', 'commanded', 
                    'asked', 'answered', 'called', 'cried', 'shouted', 'whispered', 'thought', 'knew', 'believed']
    actions = [word for word in words if word.rstrip(',.') in common_verbs]
    
    # Basic location indicators
    location_keywords = ['mount', 'mountain', 'valley', 'river', 'sea', 'desert', 'wilderness', 'city', 'town', 'village',
                         'house', 'temple', 'tabernacle', 'heaven', 'earth', 'egypt', 'israel', 'judah', 'jerusalem']
    where = [word for word in capitalized if any(loc in word.lower() for loc in location_keywords)]
    
    return {
        "who": capitalized[:3] if capitalized else [],
        "why": "",
        "when": time_matches[0] if time_matches else "",
        "where": where if where else [],
        "what": [w for w in words if w.startswith('the') or w.startswith('this') or w.startswith('that')][:3],
        "how_many": how_many if how_many > 0 else None,
        "how": "",
        "actions": actions if actions else [],
        "repetitions": repetitions if repetitions else []
    }

# ========== Main Analysis Endpoint ==========
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_scripture(request: AnalyzeRequest):
    """
    Analyze a Bible verse using the 7-question missionary framework.
    Uses local LLM (Ollama) by default, falls back to OpenAI or rule-based.
    """
    try:
        prompt = build_analysis_prompt(request)
        
        # Route to appropriate provider
        if MODEL_PROVIDER == "ollama":
            try:
                result = await call_ollama(prompt)
            except Exception as e:
                print(f"Ollama failed: {e}, falling back to rule-based")
                result = await call_local_rules(request)
        elif MODEL_PROVIDER == "openai":
            result = await call_openai(prompt)
        else:  # mock or fallback
            result = await call_local_rules(request)
        
        # Ensure all required fields exist with defaults
        response = AnalyzeResponse(
            who=result.get("who", []),
            why=result.get("why", ""),
            when=result.get("when", ""),
            where=result.get("where", []),
            what=result.get("what", []),
            how_many=result.get("how_many"),
            how=result.get("how", ""),
            actions=result.get("actions", []),
            repetitions=result.get("repetitions", []),
            raw_response=result if MODEL_PROVIDER == "mock" else None
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# ========== Batch Analysis Endpoint ==========
class BatchRequest(BaseModel):
    verses: List[AnalyzeRequest]

@app.post("/analyze/batch")
async def analyze_batch(request: BatchRequest):
    """Analyze multiple verses concurrently"""
    tasks = [analyze_scripture(verse) for verse in request.verses]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    return {
        "results": [
            r if not isinstance(r, Exception) else {"error": str(r)} 
            for r in results
        ]
    }

# ========== Health Check ==========
@app.get("/health")
async def health_check():
    """Check if LLM providers are available"""
    ollama_available = False
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{OLLAMA_URL}/api/tags")
            ollama_available = resp.status_code == 200
    except:
        pass
    
    return {
        "status": "healthy",
        "providers": {
            "ollama": ollama_available,
            "openai": bool(OPENAI_API_KEY),
            "rule_based": True
        },
        "active_provider": MODEL_PROVIDER
    }

if __name__ == "__main__":
    import uvicorn
    print(f"Starting ScriptureOS Analysis Engine...")
    print(f"Provider: {MODEL_PROVIDER}")
    if MODEL_PROVIDER == "ollama":
        print(f"Ollama URL: {OLLAMA_URL}")
        print(f"Model: {OLLAMA_MODEL}")
    print("\nServer running at http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)