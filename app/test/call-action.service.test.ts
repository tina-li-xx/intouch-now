import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import CallActionService from '../component/call-action/call-action.service';

describe('CallActionService', () => {
  it('returns a routine GP appointment action for the sample transcript', () => {
    const result = CallActionService.buildResult(
      "Hi, I've had a really bad cough for 5 days and I'd like to see a doctor. My name is John Smith and my date of birth is 2nd Jan 1990.",
      {
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
        confidence: 0.85,
      },
    );

    assert.deepEqual(result, {
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
      confidence: 0.85,
      recommended_action: {
        type: 'book_appointment',
        mode: 'gp_consultation',
      },
    });
  });

  it('asks for more information when core details are missing', () => {
    const result = CallActionService.buildResult('I have a rash and need advice.', {
      patient: {
        name: null,
        date_of_birth: null,
      },
      clinical: {
        symptoms: ['rash'],
        duration: null,
        urgency: 'routine',
      },
      intent: 'ask_advice',
      confidence: 0.7,
    });

    assert.equal(result.confidence, 0.55);
    assert.deepEqual(result.recommended_action, {
      type: 'request_more_information',
      mode: 'collect_missing_details',
    });
  });

  it('escalates emergency red flags even when extraction classifies them too softly', () => {
    const result = CallActionService.buildResult(
      'I have severe chest pain and I cannot breathe properly.',
      {
        patient: {
          name: null,
          date_of_birth: null,
        },
        clinical: {
          symptoms: ['chest pain'],
          duration: '20 minutes',
          urgency: 'routine',
        },
        intent: 'book_appointment',
        confidence: 0.8,
      },
    );

    assert.equal(result.clinical.urgency, 'emergency');
    assert.equal(result.intent, 'emergency');
    assert.deepEqual(result.recommended_action, {
      type: 'emergency_escalation',
      mode: 'emergency_services',
    });
  });
});
