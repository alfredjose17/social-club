# 📚 Secure Serverless Bookstore Application on AWS

A fully serverless bookstore application built using **Terraform** for IaC, **AWS Lambda** for backend logic (Python), **API Gateway** for routing, **DynamoDB** for data storage, **S3** for hosting a static website, and **AWS Cognito** for user authentication.

## 🚀 Features

- 🔐 User authentication with **AWS Cognito**
- ⚙️ Serverless backend with **AWS Lambda** (Python)
- 📡 RESTful API endpoints with **Amazon API Gateway**
- 💾 Book data stored in **Amazon DynamoDB**
- 🪣 Static website hosted from **Amazon S3**
- 🧱 Infrastructure provisioned using **Terraform**

## 🛠️ Tech Stack

| Layer         | Technology           |
|---------------|----------------------|
| IaC           | Terraform            |
| Frontend      | HTML, CSS, JavaScript|
| Backend       | AWS Lambda (Python)  |
| Auth          | AWS Cognito          |
| API Gateway   | REST API (AWS)       |
| Storage       | Amazon S3            |
| Database      | Amazon DynamoDB      |

## 🧱 Infrastructure Setup (Terraform)

```bash
cd terraform/
terraform init
terraform apply

## 🌐 API Endpoints

| Method | Endpoint       | Description             |
|--------|----------------|-------------------------|
| GET    | `/books`       | Fetch all books         |
| POST   | `/books`       | Add a new book          |
| PUT    | `/books/{id}`  | Update an existing book |
| DELETE | `/books/{id}`  | Delete a book           |
