# SHAWTY 🔗

**Short links that vanish after 24 hours.**

SHAWTY is a full-stack URL shortener that creates temporary, self-destructing links. Every shortened URL automatically expires after 24 hours, making it ideal for temporary sharing, testing, event registrations, project demos, and short-lived content.

🌐 **Live Demo:** https://shawty.in

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/de08aac0-9cb4-4fa9-ba57-dac30c1a6bb7"
    alt="SHAWTY Demo"
    width=500"
  />
</p>


---

## Overview

Traditional URL shorteners keep links alive indefinitely. SHAWTY takes a different approach.

Every generated link has a limited lifespan and automatically expires after 24 hours. This creates a lightweight, privacy-friendly experience for sharing temporary content without maintaining long-term records.

Users simply paste a URL, generate a short link, share it, and let it disappear.

---

## Features

### URL Shortening

Generate short, easy-to-share URLs from long links.

### Automatic Expiration

All generated links expire after 24 hours.

### Instant Redirects

Fast redirection using Redis as an in-memory datastore.

### Mobile Responsive Design

Optimized experience across desktop, tablet, and mobile devices.

### HTTPS Security

All traffic is secured using SSL certificates provided by Let's Encrypt.

### Copy to Clipboard

One-click copying of generated short URLs.

### Dockerized Deployment

Entire application stack is containerized and deployable with Docker Compose.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons

### Backend

* Python
* FastAPI

### Storage

* Redis

### Infrastructure

* Docker
* Docker Compose
* Nginx
* Let's Encrypt SSL
* GCP(Compute Engine)

---

## System Architecture

```text
User
 │
 ▼
Nginx (HTTPS)
 │
 ├── /            → React Frontend
 │
 └── /shorten
      /health
      /r/{code}
          │
          ▼
      FastAPI
          │
          ▼
        Redis
```

### Frontend

Responsible for:

* User interface
* URL submission
* Copy functionality
* Countdown display
* Responsive design

### Backend

Responsible for:

* URL shortening logic
* Redirect handling
* Validation
* API responses

### Redis

Responsible for:

* Temporary storage
* Fast lookups
* Automatic expiration support

### Nginx

Responsible for:

* HTTPS termination
* Reverse proxy
* Routing frontend and backend requests

---

## API Endpoints

### Create Short URL

**POST** `/shorten`

Request:

```json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "short_code": "abc123"
}
```

---

### Redirect

**GET**

```text
/r/{short_code}
```

Example:

```text
https://shawty.in/r/abc123
```

Returns an HTTP redirect to the original URL.

---

### Health Check

**GET**

```text
/health
```

Response:

```json
{
  "status": "ok"
}
```

---

## Project Structure

```text
shawty/
│
├── app/
│   ├── api/
│   ├── services/
│   ├── schemas/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.ts
│
├── tests/
│
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/AT8Cool/shawty.git
cd shawty
```

Start the application:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

---

## Production Deployment

The application is deployed on a Google Cloud VM using Docker Compose.

### Deployment Stack

* Google Compute Engine
* Docker
* Redis
* FastAPI
* React
* Nginx
* Let's Encrypt

### Security

* HTTPS enabled
* SSL certificates managed by Let's Encrypt
* Public access restricted to ports 80 and 443
* Internal services protected behind Nginx reverse proxy
* Backend and Redis isolated from public internet access

---

## Challenges Solved

During development and deployment:

* Frontend and backend integration
* Cross-Origin Resource Sharing (CORS)
* Docker networking
* Reverse proxy configuration
* SSL certificate setup
* Domain configuration
* Production deployment
* Cloud firewall configuration

---

## Future Improvements

* Click analytics
* Custom aliases
* QR code generation
* Rate limiting
* Branded expired-link page
* User dashboards
* Configurable expiration durations

---

## Author

**Atharva Bhosale**

Built to learn and explore:

* Full-Stack Development
* FastAPI
* React
* Redis
* Docker
* Nginx
* Cloud Deployment
* HTTPS & SSL Configuration

---

### Built with chaos, Docker, and a lot of debugging.
