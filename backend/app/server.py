# from typing import List
# from fastapi import Depends, FastAPI, HTTPException
# from fastapi.middleware import Middleware
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, validator
# from core.fastapi.middlewares import (
#     AuthenticationMiddleware,
#     AuthBackend,
#     SQLAlchemyMiddleware,
#     ResponseLogMiddleware,
# )

# app_ = FastAPI(
#     title="Hide",
#     description="Hide API",
#     version="1.0.0",
#     docs_url=None if config.ENV == "production" else "/docs",
#     redoc_url=None if config.ENV == "production" else "/redoc",
#     dependencies=[Depends(Logging)],
#     middleware=make_middleware(),
# )

# def make_middleware() -> List[Middleware]:
#     middleware = [
#         # Middleware(
#         #     CORSMiddleware,
#         #     allow_origins=["*"],
#         #     allow_credentials=True,
#         #     allow_methods=["*"],
#         #     allow_headers=["*"],
#         # ),
#         # Middleware(
#         #     AuthenticationMiddleware,
#         #     backend=AuthBackend(),
#         #     on_error=on_auth_error,
#         # ),
#         # Middleware(SQLAlchemyMiddleware),
#         Middleware(ResponseLogMiddleware),
#     ]
#     return middleware

# class TextInput(BaseModel):
#     text: str

#     @validator("text")
#     def validate_text(cls, value):
#         if not isinstance(value, str):
#             raise HTTPException(status_code=400,
#                                 detail="text must be of type string")
#         if len(value) > 30000:
#             raise HTTPException(
#                 status_code=400,
#                 detail="text must not be more than 30,000 characters")
#         return value

# @app.post("/summarize")
# def summarize(text: TextInput):
#     # text summarization logic here
#     return {"summary": "This is a summarized version of the input text"}

from typing import List

from fastapi import FastAPI, Request, Depends
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api import router
from api.home.home import home_router
from api.ai.ai import ai_router
from core.config import config
from core.exceptions import CustomException
from core.fastapi.dependencies import Logging
from core.fastapi.middlewares import (ResponseLogMiddleware)


def init_routers(app_: FastAPI) -> None:
    app_.include_router(home_router)
    app_.include_router(ai_router)
    app_.include_router(router)


def init_listeners(app_: FastAPI) -> None:
    # Exception handler
    @app_.exception_handler(CustomException)
    async def custom_exception_handler(request: Request, exc: CustomException):
        return JSONResponse(
            status_code=exc.code,
            content={
                "error_code": exc.error_code,
                "message": exc.message
            },
        )


def make_middleware() -> List[Middleware]:
    middleware = [
        # Middleware(
        #     CORSMiddleware,
        #     allow_origins=["*"],
        #     allow_credentials=True,
        #     allow_methods=["*"],
        #     allow_headers=["*"],
        # ),
        # Middleware(SQLAlchemyMiddleware),
        Middleware(ResponseLogMiddleware),
    ]
    return middleware


def create_app() -> FastAPI:
    app_ = FastAPI(
        title="AI Summarizer",
        description="AI Summarizer",
        version="0.0.1",
        docs_url=None if config.ENV == "production" else "/docs",
        redoc_url=None if config.ENV == "production" else "/redoc",
        dependencies=[Depends(Logging)],
        middleware=make_middleware(),
    )
    init_routers(app_=app_)
    init_listeners(app_=app_)
    return app_


app = create_app()
