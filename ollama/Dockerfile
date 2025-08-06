# Stage 1: Start Ollama server and download models
FROM ollama/ollama:latest AS downloader

RUN nohup ollama serve > /dev/null 2>&1 & \
    sleep 5 && \
    ollama pull llama3:8b

# Stage 2: Final image
FROM ollama/ollama:latest

COPY --from=downloader /root/.ollama /root/.ollama
