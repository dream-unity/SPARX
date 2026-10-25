// Original educational scenarios. Curriculum provenance and limits are documented in docs/.
// `correct` identifies the best-supported answer to the fictional prompt, not a judgement of a person.
export const levels = [
  {
    id: 1,
    name: 'Haven of Light',
    subtitle: 'A thought is a starting point, not a verdict.',
    biome: 'cave',
    skill: 'Notice the connection',
    extension: false,
    intro: 'The haven’s lantern has dimmed. Mira, its keeper, has mistaken one difficult moment for the whole story. Help her separate what happened from what her mind added.',
    lesson: 'Situations, interpretations, emotions, physical sensations and actions can influence each other. Naming them creates room for a different next step. Low mood is not a personal failure, and support can help.',
    transfer: 'Notice one everyday moment. Separately name what happened, what you thought, what you felt and what you did. You do not have to change any of them immediately.',
    trials: [
      {
        type: 'sort',
        title: 'Untangle the lantern threads',
        prompt: 'Mira waved to a traveller who kept walking. Place each thread in its own place.',
        categories: ['Observed event', 'Interpretation', 'Feeling', 'Action'],
        items: [
          { text: 'The traveller kept walking after Mira waved.', category: 0, explanation: 'This describes the visible event without supplying a motive.' },
          { text: '“They must dislike me.”', category: 1, explanation: 'This is one possible interpretation. Mira does not yet know their reason.' },
          { text: 'Mira felt disappointed.', category: 2, explanation: 'Disappointment is a feeling, and it can make sense even while the explanation remains uncertain.' },
          { text: 'Mira went back inside.', category: 3, explanation: 'Going inside is an action. A different action might create different information.' }
        ],
        hint: 'An event is what a camera could record. An interpretation gives it meaning.'
      },
      {
        type: 'breathe',
        title: 'Find a comfortable rhythm',
        prompt: 'Sit comfortably and let your breathing stay gentle. Follow the slow guide only if it feels comfortable; do not hold your breath or force a deep breath. You can choose the observation alternative instead.',
        hint: 'There is no perfect pace. If breathing practice feels uncomfortable, stop and notice three neutral things around you.',
        explanation: 'A short pause can create space before choosing what to do. Feeling instantly calm is not a requirement or a score.'
      },
      {
        type: 'choice',
        title: 'Relight a possibility',
        prompt: 'Mira says, “I felt low all morning, so the rest of today is already ruined.” Which response leaves room for reality and a useful next step?',
        options: [
          { text: '“Nothing bad can happen if I choose to be happy.”', correct: false, feedback: 'That promises control over feelings and events that Mira does not have.' },
          { text: '“This morning was hard. The afternoon is still unknown; I could try one small helpful thing.”', correct: true, feedback: 'This acknowledges the difficult morning without treating it as a prediction of everything ahead.' },
          { text: '“If I still feel low after trying, I have failed.”', correct: false, feedback: 'A feeling is not a pass-or-fail result. Helpful actions do not always change mood immediately.' }
        ],
        hint: 'Look for a response that acknowledges the difficulty and keeps the future open.'
      }
    ]
  },
  {
    id: 2,
    name: 'Frostfall Garden',
    subtitle: 'Small actions can open a path.',
    biome: 'ice',
    skill: 'Build a manageable day',
    extension: false,
    intro: 'The garden has grown quiet. Its keeper, Rowan, is waiting for all his motivation to return before opening the gate. Help him begin with a step small enough for today.',
    lesson: 'Enjoyable activity, connection, rest and achievable tasks can support daily life. Start with what is manageable rather than waiting for perfect motivation. Your value does not depend on how much you get done.',
    transfer: 'Choose one small activity that matters to you. Give it a time, a very small starting step and an easier backup. Notice what happens without demanding a particular mood.',
    trials: [
      {
        type: 'plan',
        title: 'Plant the first seed',
        prompt: 'Rowan has little energy and wants to reconnect with his garden. Which plan is most manageable?',
        options: [
          { text: 'Rebuild every garden bed before taking a break.', correct: false, feedback: 'An all-or-nothing target may be difficult to start. Smaller steps can make participation possible.' },
          { text: 'Wait until motivation is completely restored.', correct: false, feedback: 'Sometimes a small action can come before motivation. Waiting indefinitely gives Rowan little to try.' },
          { text: 'After breakfast, spend five minutes tending one pot, then decide whether to rest or continue.', correct: true, feedback: 'The plan names a cue, a small action and a flexible stopping point.' },
          { text: 'Do only the tasks other people praise.', correct: false, feedback: 'Approval is not the only reason to act. Pleasure, connection and personal meaning can matter too.' }
        ],
        hint: 'A useful plan has a specific cue and a step that fits the energy available.'
      },
      {
        type: 'choice',
        title: 'Release the grip',
        prompt: 'A sign offers gentle muscle relaxation. Which approach respects comfort and choice?',
        options: [
          { text: 'Notice tension; if comfortable, gently tense then release a muscle. Alternatively, simply let it soften. Stop if there is pain or discomfort.', correct: true, feedback: 'Gentle practice is optional. Observing or softening without tensing is a valid alternative.' },
          { text: 'Tense as hard as possible until the exercise works.', correct: false, feedback: 'More force is not the goal. Pain or discomfort is a reason to stop.' },
          { text: 'Keep going until every unpleasant feeling disappears.', correct: false, feedback: 'The exercise does not need to erase emotion. Comfort and choice take priority.' }
        ],
        hint: 'Choose comfort and flexibility over force or a promised emotional result.'
      },
      {
        type: 'choice',
        title: 'Open the gate',
        prompt: 'Rowan would like company but finds a whole afternoon tiring. Which message makes a clear, manageable invitation?',
        options: [
          { text: '“If you cared, you would know I need company.”', correct: false, feedback: 'This asks the other person to guess and adds blame. A specific request gives them something clear to respond to.' },
          { text: '“Would you like to sit in the garden with me for ten minutes tomorrow? It is fine if you cannot.”', correct: true, feedback: 'Rowan states what he would like, keeps it manageable and allows the other person a choice.' },
          { text: '“I will agree to anything, even if it exhausts me.”', correct: false, feedback: 'Connection can include limits. Rowan does not need to give up his needs to invite someone.' }
        ],
        hint: 'A clear request can include both connection and a limit.'
      }
    ]
  },
  {
    id: 3,
    name: 'Ember Hollow',
    subtitle: 'Feel the heat. Choose the response.',
    biome: 'fire',
    skill: 'Emotion and assertiveness',
    extension: false,
    intro: 'Two makers share the hollow’s workshop. One keeps taking Sol’s tools without asking. Anger has arrived with a message: something needs attention. Help Sol respond deliberately.',
    lesson: 'Emotions carry information, but they do not dictate a single action. Assertiveness means describing the issue, stating your needs and respecting boundaries. Listening does not require agreement or tolerating harm.',
    transfer: 'For a low-stakes situation, rehearse a short request: what happened, how it affects you and what you would like. If speaking directly is unsafe, choose support or distance instead.',
    trials: [
      {
        type: 'sort',
        title: 'Choose the shape of a response',
        prompt: 'Sort these responses to the borrowed tools by what the words do.',
        categories: ['Clear and assertive', 'Aggressive or threatening', 'Hides the need'],
        items: [
          { text: '“Please ask before taking my tools. I need them at my bench this morning.”', category: 0, explanation: 'The request is specific and includes a boundary without a threat.' },
          { text: '“Touch them again and I will smash your work.”', category: 1, explanation: 'A threat adds danger rather than clearly resolving the tools problem.' },
          { text: '“It is completely fine,” while wishing to say no.', category: 2, explanation: 'This leaves the other person without a clear request. Staying quiet can still be a deliberate safety choice in some situations.' },
          { text: '“You can borrow the spare set after lunch if you return it by four.”', category: 0, explanation: 'A negotiated option can keep a clear limit. Sol can also decline if lending is not workable.' }
        ],
        hint: 'Look for a clear need and boundary, without an insult or threat.'
      },
      {
        type: 'choice',
        title: 'Listen without surrendering the boundary',
        prompt: 'The other maker says, “I thought they were shared.” What is a constructive reply?',
        options: [
          { text: '“Then my concern does not matter.”', correct: false, feedback: 'Understanding their explanation does not erase Sol’s need for a boundary.' },
          { text: '“You are obviously lying.”', correct: false, feedback: 'The prompt does not establish dishonesty. Sol can address the behaviour without deciding the person’s motive.' },
          { text: '“I hear that you thought they were shared. This set is mine. Let us label the shared set so it is clearer.”', correct: true, feedback: 'This acknowledges the explanation, keeps the boundary and offers a practical next step.' }
        ],
        hint: 'You can acknowledge another view while keeping your own clear limit.'
      },
      {
        type: 'sequence',
        title: 'Make room before responding',
        prompt: 'For this safe, non-urgent disagreement, arrange a deliberate response.',
        steps: [
          'Notice the anger and the urge to react.',
          'Take a brief pause or step back if useful.',
          'Identify the specific boundary or need.',
          'Make a clear request and consider the response.'
        ],
        hint: 'Notice first, create some space, then decide what you need to communicate.',
        explanation: 'This is one useful practice sequence, not a rule for every situation. Immediate danger calls for safety and support rather than a conversation exercise.'
      }
    ]
  },
  {
    id: 4,
    name: 'Cloudstep Ridge',
    subtitle: 'Turn an overwhelming problem into a next step.',
    biome: 'mountain',
    skill: 'Practical problem solving',
    extension: false,
    intro: 'A supply cart cannot reach the ridge because one crossing is damaged. The team is arguing about everything at once. Help them name the part they can work on.',
    lesson: 'Define a specific problem, generate options, compare consequences, try a feasible step and review what happened. A plan can improve the next move without guaranteeing the final outcome.',
    transfer: 'Write one small problem in concrete terms. List at least two possible actions, choose one feasible step and decide when you will review it.',
    trials: [
      {
        type: 'choice',
        title: 'Find the workable problem',
        prompt: 'Which description gives the ridge team a useful starting point?',
        options: [
          { text: '“Everything always goes wrong for us.”', correct: false, feedback: 'This broad conclusion hides the specific obstacle the team might address.' },
          { text: '“The cart needs a safe route to the storehouse before tomorrow afternoon.”', correct: true, feedback: 'This names a concrete need and a timeframe without assuming a solution.' },
          { text: '“Everyone must stop being difficult.”', correct: false, feedback: 'The team cannot directly control everyone’s attitude. It can investigate routes and responsibilities.' }
        ],
        hint: 'Choose a concrete need, rather than a global judgement.'
      },
      {
        type: 'sequence',
        title: 'Build the route',
        prompt: 'Arrange the problem-solving stones in a useful order.',
        steps: [
          'Describe the specific problem.',
          'Generate several possible actions.',
          'Compare safety, effort and likely consequences.',
          'Choose and try a feasible action.',
          'Review what happened and adjust.'
        ],
        hint: 'Compare several options before committing. Leave room to learn from the result.',
        explanation: 'Reviewing is part of problem solving. A first attempt that needs adjustment can still provide useful information.'
      },
      {
        type: 'plan',
        title: 'Try a step within reach',
        prompt: 'The alternate route might work, but its condition is unknown. Which plan best handles that uncertainty?',
        options: [
          { text: 'Send the loaded cart immediately and hope.', correct: false, feedback: 'That commits to an unverified route without checking a practical risk.' },
          { text: 'Abandon the supplies because success is uncertain.', correct: false, feedback: 'Uncertainty does not mean every option is closed. Information-gathering may be possible.' },
          { text: 'Promise that the alternate route is definitely safe.', correct: false, feedback: 'Confidence cannot replace information that the team does not yet have.' },
          { text: 'Ask the route keeper to check conditions, then choose a safe option or arrange a later delivery.', correct: true, feedback: 'This gathers relevant information and keeps a backup available.' }
        ],
        hint: 'A helpful next step can be checking information rather than forcing an immediate answer.'
      }
    ]
  },
  {
    id: 5,
    name: 'Mistwood Marsh',
    subtitle: 'Recognise the pattern before following it.',
    biome: 'swamp',
    skill: 'Notice thinking patterns',
    extension: false,
    intro: 'The marsh repeats whatever a traveller whispers. A passing worry can sound like a certainty after enough echoes. Read the signs carefully before choosing a path.',
    lesson: 'Thinking patterns are shortcuts to notice, not labels for a person. A thought can feel convincing without being fully supported. Some concerns are accurate; investigate the situation rather than declaring every negative thought false.',
    transfer: 'Catch one strong conclusion. Ask which part is directly supported, which part is inferred and what remains unknown.',
    trials: [
      {
        type: 'sort',
        title: 'Name the marsh echoes',
        prompt: 'Match each clearly exaggerated thought with its main pattern.',
        categories: ['All-or-nothing', 'Mind-reading', 'Predicting the future', 'Overgeneralising'],
        items: [
          { text: '“Unless every note is perfect, the entire song is worthless.”', category: 0, explanation: 'This allows only perfection or total failure, excluding useful middle ground.' },
          { text: '“They looked away, so I know they think I am boring.”', category: 1, explanation: 'This claims to know another person’s private judgement from limited information.' },
          { text: '“Tomorrow’s talk will definitely go badly.”', category: 2, explanation: 'A future outcome is being treated as settled before it happens.' },
          { text: '“I missed this one invitation; nobody ever includes me.”', category: 3, explanation: 'One event is being extended into an unlimited rule.' }
        ],
        hint: 'Look for certainty about minds, certainty about the future, two extreme categories, or one event becoming a universal rule.'
      },
      {
        type: 'choice',
        title: 'A concern can be real',
        prompt: 'A traveller has received several insulting messages. Which response avoids misusing the idea of “unhelpful thinking”?',
        options: [
          { text: '“The messages are real. I can keep a record, set a boundary and seek support.”', correct: true, feedback: 'Recognising actual mistreatment and choosing protective action is compatible with careful thinking.' },
          { text: '“Feeling hurt proves I am thinking incorrectly.”', correct: false, feedback: 'Hurt can be an understandable response to mistreatment. It is not proof of a thinking error.' },
          { text: '“I must invent a friendly reason for every insult.”', correct: false, feedback: 'Balanced thinking does not require excusing harmful conduct or assuming good intentions.' }
        ],
        hint: 'Distinguish an unsupported interpretation from documented behaviour.'
      },
      {
        type: 'choice',
        title: 'Notice without attacking yourself',
        prompt: 'You notice the thought “I always mess everything up.” What is a useful next move?',
        options: [
          { text: 'Criticise yourself for having the thought.', correct: false, feedback: 'Adding another harsh judgement usually does not clarify the original situation.' },
          { text: 'Declare that you have never made a mistake.', correct: false, feedback: 'The opposite extreme is not more accurate.' },
          { text: 'Name the broad conclusion, then look at the specific event and other examples.', correct: true, feedback: 'This creates distance from the absolute claim and checks it against a fuller picture.' }
        ],
        hint: 'Investigate the conclusion with curiosity rather than replacing it with a new absolute.'
      }
    ]
  },
  {
    id: 6,
    name: 'Bridge of Perspective',
    subtitle: 'Build a thought that can carry the evidence.',
    biome: 'bridge',
    skill: 'Develop balanced alternatives',
    extension: false,
    intro: 'A bridge has lost three of its supports: evidence, uncertainty and a workable response. Help the travellers rebuild it without pretending the river is not there.',
    lesson: 'A helpful alternative is believable, proportionate and connected to evidence. It can acknowledge disappointment, risk and uncertainty while leaving room for action. Negotiation seeks workable terms; it does not require surrendering your needs.',
    transfer: 'Choose a low-stakes worry. Write the evidence you have, what you do not know, a balanced interpretation and one proportionate next step.',
    trials: [
      {
        type: 'sort',
        title: 'Inspect the bridge supports',
        prompt: 'A friend has not replied to a message sent two hours ago. Separate what is known from the explanations being considered.',
        categories: ['Known from the scenario', 'Possible explanation', 'Unsupported certainty'],
        items: [
          { text: 'No reply has arrived in two hours.', category: 0, explanation: 'This is the information actually supplied.' },
          { text: 'The friend might be occupied.', category: 1, explanation: 'This is possible, but it has not been confirmed.' },
          { text: 'The friendship is definitely over.', category: 2, explanation: 'The available information does not establish this conclusion.' },
          { text: 'The friend might be upset about something.', category: 1, explanation: 'This is also possible. A balanced view does not permit only reassuring explanations.' }
        ],
        hint: 'A possibility can be pleasant or unpleasant. Neither becomes a fact just because it feels convincing.'
      },
      {
        type: 'choice',
        title: 'Find a believable alternative',
        prompt: 'A maker’s application was declined. They think, “This proves I have no ability.” Which alternative fits the evidence?',
        options: [
          { text: '“I am secretly the best applicant and they are all wrong.”', correct: false, feedback: 'This swaps one unsupported conclusion for another.' },
          { text: '“This rejection hurts. It is one decision, not a complete measure of my ability. I can ask for feedback and consider another opportunity.”', correct: true, feedback: 'The response acknowledges the real setback and limits what can be concluded from it.' },
          { text: '“The rejection did not happen.”', correct: false, feedback: 'A useful alternative works with the event rather than denying it.' }
        ],
        hint: 'Keep the fact, soften the unsupported verdict and identify a choice.'
      },
      {
        type: 'plan',
        title: 'Negotiate a workable crossing',
        prompt: 'Two travellers want the only cart at the same time. Neither journey is urgent. What could they try?',
        options: [
          { text: 'Describe each trip’s timing, then see whether sharing or taking turns would meet both needs.', correct: true, feedback: 'This looks for relevant information and a practical agreement. Either traveller can say if an option will not work.' },
          { text: 'Assume the other traveller is selfish before hearing the reason.', correct: false, feedback: 'A motive is being assigned before the practical constraints are understood.' },
          { text: 'The quieter traveller must always give way.', correct: false, feedback: 'Negotiation should not automatically erase one person’s needs.' }
        ],
        hint: 'Start by understanding the constraints and needs on both sides.'
      }
    ]
  },
  {
    id: 7,
    name: 'Stillwater Canyon',
    subtitle: 'A difficult day does not erase your progress.',
    biome: 'canyon',
    skill: 'Bring the skills together',
    extension: false,
    intro: 'Rain returns to the canyon after several clear days. The travellers worry that all their work has been undone. Help them use their tools while the weather is difficult.',
    lesson: 'Progress can include setbacks. You can acknowledge distress, take a manageable action and ask for support without first making the feeling disappear. Persistent or worsening difficulties deserve attention from a qualified professional.',
    transfer: 'Make a simple difficult-day plan: a sign to notice, one manageable supportive action, and a person or professional you could contact.',
    trials: [
      {
        type: 'choice',
        title: 'Let the feeling be present',
        prompt: 'A traveller feels disappointed after plans are cancelled. Which response practises tolerating the feeling?',
        options: [
          { text: '“I must remove this feeling before I can do anything.”', correct: false, feedback: 'You do not always need emotional certainty or comfort before a small useful action.' },
          { text: '“Being disappointed means all my progress is gone.”', correct: false, feedback: 'A difficult emotion does not erase what the traveller has learned.' },
          { text: '“Disappointment is here. I can notice it, let it take some space and choose a gentle next step.”', correct: true, feedback: 'This allows the emotion without making it the only guide for action.' }
        ],
        hint: 'Look for allowing a feeling and retaining choice, rather than demanding instant relief.'
      },
      {
        type: 'sequence',
        title: 'Pack a difficult-day kit',
        prompt: 'Arrange this practical planning sequence before the next difficult day arrives.',
        steps: [
          'Notice a personal sign that things are becoming harder.',
          'Choose a small supportive action that is realistic.',
          'Identify a trusted person or professional to contact.',
          'Decide when to review the plan and seek more support.'
        ],
        hint: 'Start with what you might notice, then prepare actions and support.',
        explanation: 'This is a planning exercise, not an instruction to delay asking for help. Support can come first whenever it is needed.'
      },
      {
        type: 'choice',
        title: 'Know when the toolkit is not enough',
        prompt: 'A traveller has found daily life increasingly difficult for several weeks, despite trying the game’s exercises. What is the most useful response?',
        options: [
          { text: 'Reach out to a qualified health professional or trusted support person and explain what has been happening.', correct: true, feedback: 'Seeking more support is a constructive step. This educational game does not assess or treat a person’s difficulties.' },
          { text: 'Replay until a completion badge proves they are well.', correct: false, feedback: 'Game completion cannot establish mental health or replace appropriate assessment.' },
          { text: 'Conclude they did not try hard enough.', correct: false, feedback: 'Difficulty is not evidence of insufficient effort. The person may need different or additional support.' }
        ],
        hint: 'The right next step can be getting support beyond the game.'
      }
    ]
  },
  {
    id: 8,
    name: 'Observatory of Assumptions',
    subtitle: 'Examine the rule beneath the reaction.',
    biome: 'observatory',
    skill: 'Question underlying assumptions',
    extension: true,
    intro: 'The observatory’s lenses turn guesses into constellations. Some lenses carry hidden rules about approval, mistakes and worth. Learn to see the lens as well as the sky.',
    lesson: 'An observation describes an event. An interpretation explains it. An underlying rule says what must happen for you to be acceptable or secure. Rules can be examined and made more flexible without denying real needs or real harm.',
    transfer: 'Notice an “if…then…” or “I must…” rule in a low-stakes moment. Ask whether it is a preference, a practical requirement or a global judgement about your worth.',
    trials: [
      {
        type: 'sort',
        title: 'Separate stars from connecting lines',
        prompt: 'A researcher’s proposal receives two criticisms. Sort the statements into their different roles.',
        categories: ['Observation', 'Interpretation', 'Underlying rule'],
        items: [
          { text: 'The reviewer identified two issues with the proposal.', category: 0, explanation: 'This reports the event described in the scenario.' },
          { text: '“They probably think I am incapable.”', category: 1, explanation: 'This adds an interpretation of another person’s judgement.' },
          { text: '“If someone criticises my work, I cannot be a worthwhile person.”', category: 2, explanation: 'This conditional rule ties personal worth to another person’s response.' },
          { text: '“Competent people must never need to revise their work.”', category: 2, explanation: 'This is a rigid rule about what competence is allowed to look like.' }
        ],
        hint: 'Look beneath “what happened” and “what it means” for “what must always be true”.'
      },
      {
        type: 'choice',
        title: 'Loosen a rule without losing a value',
        prompt: 'A keeper values being useful but believes, “Unless everyone approves of me, I have no value.” Which revision preserves the value while questioning the rule?',
        options: [
          { text: '“Other people never matter.”', correct: false, feedback: 'This rejects connection rather than making the approval rule more flexible.' },
          { text: '“I must become so impressive that nobody can ever criticise me.”', correct: false, feedback: 'This keeps the same impossible dependence on universal approval.' },
          { text: '“I care about contributing and about feedback. Disagreement can matter without determining my entire worth.”', correct: true, feedback: 'The keeper keeps their chosen value while loosening the global verdict attached to approval.' },
          { text: '“Every criticism is secretly praise.”', correct: false, feedback: 'That would distort feedback rather than help the keeper evaluate it.' }
        ],
        hint: 'A value can guide you without becoming a condition you must satisfy to have worth.'
      },
      {
        type: 'choice',
        title: 'Update when evidence changes',
        prompt: 'At first, a missed invitation had several possible explanations. Later, the organiser explicitly says they intentionally excluded the traveller. What should change?',
        options: [
          { text: 'Keep insisting the exclusion was accidental because that feels kinder.', correct: false, feedback: 'Balanced thinking updates when new information arrives. Reassurance should not overrule direct evidence.' },
          { text: 'Acknowledge the intentional exclusion, consider boundaries or support, and avoid concluding that every person will behave this way.', correct: true, feedback: 'This accepts the relevant evidence without expanding one person’s conduct into a universal prediction.' },
          { text: 'Conclude that no one can ever be trusted.', correct: false, feedback: 'The evidence concerns this organiser and event. It does not establish the motives of every other person.' }
        ],
        hint: 'Revise the part the evidence addresses. Do not deny it or extend it beyond what it shows.'
      }
    ]
  },
  {
    id: 9,
    name: 'Experiment Workshop',
    subtitle: 'Trade a sweeping prediction for a small test.',
    biome: 'workshop',
    skill: 'Learn from safe experiments',
    extension: true,
    intro: 'The workshop builds instruments for questions that cannot be settled by thinking alone. Design a small, ordinary test, then let the result teach you something proportionate.',
    lesson: 'A useful everyday experiment has a specific prediction, a safe action, an observable result and a review. It tests an idea, not your value. Do not use these exercises to test danger, health limits or another person’s boundaries.',
    transfer: 'For an ordinary low-stakes activity, write one prediction and a small safe test. Decide what you will observe. Review the result without treating one attempt as a universal verdict.',
    trials: [
      {
        type: 'sequence',
        title: 'Build an honest experiment',
        prompt: 'A maker predicts that asking one ordinary clarification question will make their tutor refuse to help. Arrange a fair test.',
        steps: [
          'Write the specific prediction before acting.',
          'Choose a small, safe and respectful action.',
          'Decide which observable response would inform the prediction.',
          'Try the action and record what actually happens.',
          'Review the result, its limits and a possible next step.'
        ],
        hint: 'Set the prediction and observation before you know the outcome.',
        explanation: 'Planning first helps prevent changing the question after seeing the result. The outcome can be mixed or inconclusive.'
      },
      {
        type: 'choice',
        title: 'Keep the test safe and specific',
        prompt: 'Which is a suitable low-stakes experiment for “If I ask for clarification, people will always refuse to help”?',
        options: [
          { text: 'Ask a willing tutor one relevant question during their usual question time and note their response.', correct: true, feedback: 'This is specific, respectful and observable. It can inform the prediction without testing danger or violating a boundary.' },
          { text: 'Ignore a clear refusal and keep contacting someone until they respond.', correct: false, feedback: 'An experiment does not override consent or another person’s boundary.' },
          { text: 'Choose a threatening person to make the test more convincing.', correct: false, feedback: 'The goal is useful learning from a safe everyday action, not exposure to danger.' },
          { text: 'Ask no one, but decide what they would certainly say.', correct: false, feedback: 'That repeats the prediction without gathering new information.' }
        ],
        hint: 'Choose an ordinary action with a willing person, a clear limit and something you can observe.'
      },
      {
        type: 'choice',
        title: 'Read a mixed result carefully',
        prompt: 'The tutor says, “I cannot answer now, but bring it tomorrow.” What does this result support?',
        options: [
          { text: 'Nobody will ever help.', correct: false, feedback: 'A postponement from one person cannot establish a universal refusal.' },
          { text: 'Everyone will always help immediately.', correct: false, feedback: 'The result does not support that reassuring absolute either.' },
          { text: 'The tutor did not answer immediately and offered another time. The original “always refuse” prediction needs revision, while tomorrow’s outcome remains unknown.', correct: true, feedback: 'This describes both parts of the response and updates only as far as the evidence allows.' }
        ],
        hint: 'Describe the observed response precisely before deciding what it means.'
      }
    ]
  },
  {
    id: 10,
    name: 'Beacon Summit',
    subtitle: 'Choose the tool that fits the moment.',
    biome: 'summit',
    skill: 'Transfer and continued practice',
    extension: true,
    intro: 'The summit beacon needs more than one kind of light. New situations will ask for different tools: sometimes reflection, sometimes action, sometimes a boundary and sometimes help.',
    lesson: 'Flexible practice means choosing a skill for the actual situation and changing course when new evidence appears. Completing this journey records learning activities; it does not measure your health, intelligence or everyday psychological competence.',
    transfer: 'Choose one skill to practise in a new everyday situation. Write a cue, a small action and a review time. Keep support available and adjust the plan as life changes.',
    trials: [
      {
        type: 'choice',
        title: 'Hold more than one truth',
        prompt: 'A teammate repeatedly interrupts you. You feel angry and think, “Nobody here respects me; I should leave every project.” What is the most proportionate first response, assuming the conversation is safe?',
        options: [
          { text: 'Tell yourself the interruptions never happened.', correct: false, feedback: 'That dismisses the observed behaviour and your legitimate concern.' },
          { text: 'Notice the anger, address the specific interruptions with a clear boundary, and check the wider conclusion against other evidence.', correct: true, feedback: 'This combines emotion awareness, practical assertiveness and examination of an overbroad conclusion.' },
          { text: 'Demand that everyone proves they respect you before continuing.', correct: false, feedback: 'The request is broad and difficult to verify. A specific behavioural boundary is more actionable.' },
          { text: 'Assume every future team will be the same.', correct: false, feedback: 'The current problem matters, but it does not settle every future situation.' }
        ],
        hint: 'Keep the real concern, respond to it and examine the part that extends beyond the evidence.'
      },
      {
        type: 'sort',
        title: 'Match a first tool to the need',
        prompt: 'Several tools may help. Match each situation to the most directly relevant starting tool named here.',
        categories: ['Small activity plan', 'Check an interpretation', 'Practical problem solving', 'Ask for additional support'],
        items: [
          { text: 'You want to return to drawing but the idea of a whole finished picture feels too large.', category: 0, explanation: 'A two-minute sketch with a clear cue can make starting more manageable.' },
          { text: 'One neutral facial expression has become “They certainly hate me” in your mind.', category: 1, explanation: 'Separate the expression you observed from the certainty you added.' },
          { text: 'Two appointments clash and you need to arrange a feasible timetable.', category: 2, explanation: 'Identify the constraints, contact the relevant people and compare options.' },
          { text: 'Difficulties keep worsening and interfere with daily life despite your attempts to manage them.', category: 3, explanation: 'A qualified professional or trusted support person can help identify appropriate next steps.' }
        ],
        hint: 'Ask what the immediate task is: beginning, interpreting, organising or getting more support.'
      },
      {
        type: 'plan',
        title: 'Carry the light beyond the summit',
        prompt: 'Which plan gives you a useful way to continue learning after the final level?',
        options: [
          { text: 'Choose one skill, a specific everyday cue, a manageable action and a review time; adapt or seek support if needed.', correct: true, feedback: 'This turns an idea into a flexible practice plan. Different outcomes can teach you what to adjust.' },
          { text: 'Treat the final badge as proof you will handle every situation well.', correct: false, feedback: 'Completing a game cannot validate how someone will respond across everyday life.' },
          { text: 'Use every skill perfectly every day, with no setbacks allowed.', correct: false, feedback: 'That creates another rigid standard. Sustainable practice allows limits, mistakes and revision.' },
          { text: 'Keep practising only when you can guarantee feeling better immediately.', correct: false, feedback: 'Useful learning and action do not always produce an immediate mood change.' }
        ],
        hint: 'Choose a plan that is concrete enough to try and flexible enough to revise.'
      }
    ]
  }
];

export const sources = [
  {
    title: 'Merry and colleagues (2012): original SPARX trial and seven-level curriculum',
    url: 'https://www.bmj.com/content/344/bmj.e2598',
    description: 'Box 2 documents the original programme. Its clinical results apply to that studied intervention, not this adaptation.'
  },
  {
    title: 'Shepherd and colleagues (2015): participatory and cultural design',
    url: 'https://games.jmir.org/2015/1/e1/',
    description: 'Developer-authored research describes the fantasy-game structure and the importance of meaningful cultural participation.'
  },
  {
    title: 'Cheek and colleagues (2014): rural Australian youth perspectives',
    url: 'https://games.jmir.org/2014/1/e3/',
    description: 'Qualitative research explores privacy, choice, story, avatar customisation, feedback and optional journaling.'
  },
  {
    title: 'Fleming and colleagues (2019): how the programme is presented',
    url: 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2019.00802/full',
    description: 'Youth perspectives show that welcoming language and explicit acknowledgement of depression can serve different preferences.'
  },
  {
    title: 'Developer interview: SPARX gameplay and learning (2019)',
    url: 'https://www.rcpsych.ac.uk/news-and-features/blogs/detail/cultural-blog/2019/01/17/the-serious-game-that-provides-cbt-dr-mathijs-lucassen-discusses-sparx',
    description: 'Describes the Guide, story, simple gameplay and the distinction between programme progression and game mastery.'
  },
  {
    title: 'Official SPARX programme',
    url: 'https://www.sparx.org.nz/the-game',
    description: 'Information about the original programme, which is separate from this independent educational project.'
  }
];
