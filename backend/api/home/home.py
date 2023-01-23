from fastapi import APIRouter
from fastapi.responses import JSONResponse

home_router = APIRouter()


# dependencies=[Depends()]
@home_router.get("/")
async def root():
    # return Response(status_code=200)
    return JSONResponse(status_code=404, content={"message": "all good"})
