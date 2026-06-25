import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import app from '../../app';
import CallProcessingService from '../../component/call-processing/call-processing.service';

describe('app', () => {
  it('returns the API welcome response', async () => {
    const response = await request(app).get('/');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'InTouchNow.ai call processing API',
      status: true,
    });
  });

  it('validates missing transcripts', async () => {
    const response = await request(app).post('/process-call').send({});

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'invalid request body',
      status: false,
    });
  });

  it('wraps processed calls in a success response body', async () => {
    const processCall = CallProcessingService.process;
    CallProcessingService.process = async () => ({
      patient: {
        name: 'John Smith',
        date_of_birth: '1990-01-02',
      },
      clinical: {
        symptoms: ['cough'],
        duration: '5 days',
        urgency: 'routine',
      },
      intent: 'book_appointment',
      confidence: 0.9,
      recommended_action: {
        type: 'book_appointment',
        mode: 'gp_consultation',
      },
    });

    try {
      const response = await request(app).post('/process-call').send({
        transcript:
          "Hi, I've had a cough for 5 days. My name is John Smith and my date of birth is 2nd Jan 1990.",
      });

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, {
        status: true,
        body: {
          patient: {
            name: 'John Smith',
            date_of_birth: '1990-01-02',
          },
          clinical: {
            symptoms: ['cough'],
            duration: '5 days',
            urgency: 'routine',
          },
          intent: 'book_appointment',
          confidence: 0.9,
          recommended_action: {
            type: 'book_appointment',
            mode: 'gp_consultation',
          },
        },
      });
    } finally {
      CallProcessingService.process = processCall;
    }
  });

  it('returns a clean API error for unsupported routes', async () => {
    const response = await request(app).get('/process-call');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'No endpoint found for GET /process-call.',
      status: false,
    });
  });
});
