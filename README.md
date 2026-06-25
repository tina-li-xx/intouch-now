# InTouchNow.ai Call Processing

Small TypeScript/Express API that accepts a patient call transcript, extracts structured information with OpenAI, validates the output, and returns the next recommended action.

## Repository

GitHub: https://github.com/tina-li-xx/intouch-now

Default branch: `main`

## How to Run

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env
```

Add your OpenAI key to `.env`:

```bash
OPENAI_API_KEY=sk-...
```

Then run:

```bash
npm run dev
```

The API uses `PORT` when set and falls back to `8080`, so the default local URL is `http://localhost:8080`.

## Endpoint

```http
POST /process-call
Content-Type: application/json
```

Request:

```json
{
  "transcript": "Hi, I've had a really bad cough for 5 days and I'd like to see a doctor. My name is John Smith and my date of birth is 2nd Jan 1990."
}
```

Curl:

```bash
curl -X POST http://localhost:8080/process-call \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Hi, I have had a really bad cough for 5 days and I would like to see a doctor. My name is John Smith and my date of birth is 2nd Jan 1990."
  }'
```

Response:

```json
{
  "status": true,
  "body": {
    "patient": {
      "name": "John Smith",
      "date_of_birth": "1990-01-02"
    },
    "clinical": {
      "symptoms": ["cough"],
      "duration": "5 days",
      "urgency": "routine"
    },
    "intent": "book_appointment",
    "confidence": 0.9,
    "recommended_action": {
      "type": "book_appointment",
      "mode": "gp_consultation"
    }
  }
}
```

Error response:

```json
{
  "message": "invalid request body",
  "status": false
}
```

## Useful Commands

```bash
npm run test
npm run lint
npm run build
```

Tests are split into unit and integration tests. They do not call the OpenAI API.

## Approach

- `POST /process-call` validates that a transcript has been provided.
- OpenAI extracts patient, clinical, intent, urgency, and confidence fields from the transcript.
- Zod validates both the request body and the structured output.
- Successful responses are returned under `body` with `status: true`.
- The final recommended action is chosen in `call-action`, where emergency, missing-information, urgent, prescription, callback, and appointment routing rules are handled in code.
- Unit tests cover call-action routing rules. Integration tests cover request validation, response shape, and unsupported routes without calling the OpenAI API.

## Assumptions

- The API supports operational call routing only; it does not make a medical diagnosis.
- Transcripts are plain-text patient call transcripts in English.
- Date of birth is returned in `YYYY-MM-DD` format when present; otherwise it is returned as `null`.
- If core details are missing, the recommended action is `request_more_information` unless the transcript contains emergency red flags.
- Emergency red flags take priority over missing details.
