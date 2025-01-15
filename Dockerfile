FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install pre-commit
RUN pip install pre-commit

# Install node and npm
RUN apt-get update && apt-get install -y nodejs npm

# Install prettier and other node dependencies
RUN npm install -g prettier

# Install Rust and Cargo
RUN apt-get install -y curl && curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy the rest of the application code
COPY . .

# Install pre-commit hooks
RUN pre-commit install-hooks

# Set the entrypoint to run pre-commit
ENTRYPOINT ["pre-commit", "run", "--all-files"]
