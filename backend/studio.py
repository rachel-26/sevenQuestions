from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="ScriptureOS Analysis Engine")

# Configure CORS so the React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    book: str
    chapter: int
    verse: int
    text: str

class AnalyzeResponse(BaseModel):
    who: str
    why: str
    when: str
    where: str
    which: str
    how: str
    actions: list[str]

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_scripture(request: AnalyzeRequest):
    """
    Automated Analysis Endpoint.
    
    TODO: Replace this mock implementation with your actual LLM logic.
    For example, you could use langchain to prompt OpenAI with:
    'Analyze {request.book} {request.chapter}:{request.verse} - "{request.text}" using the 7-question missionary framework.'
    """
    print(f"Analyzing {request.book} {request.chapter}:{request.verse} - {request.text}")
    
    # Mock AI response based on the verse input
    return AnalyzeResponse(
        who=f"Primary figures mentioned in {request.book} {request.chapter}:{request.verse}",
        why="To demonstrate the narrative purpose of this specific action or statement.",
        when="Historical context implied by the surrounding verses.",
        where="The geographical or metaphysical location described.",
        which="Specific choices or objects highlighted in the text.",
        how="The mechanism or manner in which the event unfolds.",
        actions=[
            "Document key themes in a personal journal",
            f"Cross-reference with parallel passages to {request.book}",
            "Reflect on theological implications"
        ]
    )

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
