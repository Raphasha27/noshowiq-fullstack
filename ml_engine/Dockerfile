FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
# Create requirements if missing (basic fastapi setup)
RUN if [ ! -f requirements.txt ]; then echo "fastapi\nuvicorn\ntorch\nscikit-learn\npandas\nnumpy" > requirements.txt; fi
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
