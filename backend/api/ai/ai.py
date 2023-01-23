from fastapi import APIRouter, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from core.ai.summarize.summarize import get_task, create_task, process_task

ai_router = APIRouter()

class CraeteSummarizeTaskRequestPayload(BaseModel):
    text: str


# dependencies=[Depends()]
@ai_router.get("/ai")
async def root():
    # return Response(status_code=200)
    return JSONResponse(status_code=404, content={"message": "AI root"})

@ai_router.post("/ai/summarize/task")
async def craete_summarize_task(payload: CraeteSummarizeTaskRequestPayload, background_tasks: BackgroundTasks):
    text = payload.text
    task = create_task(text)

    background_tasks.add_task(process_task, task)

    res = vars(task).copy()
    res.pop('text', None)

    return res

@ai_router.get("/ai/summarize/tasks/{id}")
async def get_summarize_task(id: str):
    task = get_task(id=id)
    if (task is None):
        return JSONResponse(status_code=404, content={"message": "not found"})

    return task
