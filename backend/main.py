import asyncio
import time
import click
import uvicorn
import os
from config import config
from signal import SIGINT, SIGTERM

@click.command()
@click.option(
    "--env",
    type=click.Choice(["dev", "stage", "prod"], case_sensitive=False),
    default="dev",
)
@click.option(
    "--debug",
    type=click.BOOL,
    is_flag=True,
    default=False
)
def main(env: str, debug: bool):
    os.environ["ENV"] = env
    os.environ["DEBUG"] = str(debug)
    uvicorn.run(
        app="app.server:app",
        host=config.APP_HOST,
        port=config.APP_PORT,
        reload=True if config.ENV != "production" else False,
        workers=3,
    )


if __name__ == "__main__":
    asyncio.run(main())
