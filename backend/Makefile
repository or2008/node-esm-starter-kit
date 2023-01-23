install:
	pip3 install -r requirements.txt
server:
	uvicorn server:app --reload --port 8080
start-dev:
	python3 main.py --env dev --debug
start-stage:
	python3 main.py --env stage --debug
start-prod:
	python3 main.py --env prod --debug