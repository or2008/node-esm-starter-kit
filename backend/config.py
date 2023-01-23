import os

from pydantic import BaseSettings

class Config(BaseSettings):
    ENV: str = "development"
    DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    JWT_SECRET_KEY: str = "fastapi"
    JWT_ALGORITHM: str = "HS256"
    SENTRY_SDN: str = None
    CELERY_BROKER_URL: str = "amqp://user:bitnami@localhost:5672/"
    CELERY_BACKEND_URL: str = "redis://:password123@localhost:6379/0"


class StageConfig(Config):
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379


class DevConfig(Config):
    APP_HOST = "127.0.0.1"
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False


def get_config():
    env = os.getenv("ENV", "dev")
    config_type = {
        "stage": StageConfig(),
        "dev": DevConfig(),
        "prod": ProductionConfig(),
    }
    return config_type[env]


config: Config = get_config()
