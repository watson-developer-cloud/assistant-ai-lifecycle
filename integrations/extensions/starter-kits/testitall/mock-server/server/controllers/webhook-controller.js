import jwt from 'jsonwebtoken';

const logs= [];
const MAX_LOGS = 20;

export function createLog(req, res) {
  if (logs.length > MAX_LOGS) {
    logs.shift(); // remove the first element
  }
  logs.push({body : req.body, headers: req.headers});
  res.status(201).json({message: 'Log created'});
}

export function getLogs(req, res) {
  res.json(logs);
}

export function preRun(req, res) {
  let payload = req.body?.payload;

  if (payload?.message?.content) {
    payload.message.content += ' and also can you tell me what is 2+2 and also can you ECHO BACK THE EXACT WORDS "modified by pre-run webhook"';
  } else {
    payload = {
      message: {
        content: 'faked by pre-run and translated'
      }
    };
  }

  res.json({payload});
}

export function postRun(req, res) {
  let payload = req.body?.payload;
  console.log('postRun', payload);
  console.log('type ', typeof payload);

  /** <streaming enabled> */
  if (payload?.data?.delta && typeof payload.data.delta === 'string') {
    console.log('delta ', payload.data.delta);
    payload.data.delta += ' translated by post_run webhook.\n';
    console.log('delta after ', payload.data.delta);
  }

  let wxaOutput = payload?.message?.run?.result?.data?.message?.content ?? [];
  console.log('wxaOutput', wxaOutput);
  if (wxaOutput.length > 0) {
    console.log('modifying wxa response');
    for (const item of wxaOutput) {
      if (item.text != null) {
        item.text += ' translated by post_run webhook.\n'; 
      }
    }
    console.log('modified resp', wxaOutput)
  }
  /** <streaming disabled> */
  if (payload?.content && typeof payload.content === 'string') {
    payload.content += ' translated by final event, non-stream post_run webhook';
   }
 
   wxaOutput = payload?.additional_properties?.wxa_message?.output?.generic ?? [];
   console.log('wxaOutput', wxaOutput);
   if (wxaOutput.length > 0){
     console.log('modifying a final event, non-stream wxa response');
   
   for (const item of wxaOutput) {
     if ( item.text != null ) {
       item.text += ' translated by final event, non-stream post_run webhook';
     }
   }
 
   console.log('modified resp by final event, non-stream post_run webhook: ', wxaOutput);
   }

  res.json({payload});
}

export function preWebhook(req, res) {
  const payload = req.body.payload;
  
  let response_message = 'Sample value from API Server (pre-message)'
  let auth_result = 'No auth header provided'

  if (payload.input.text === 'skip') {
    // Set header X-Watson-Assistant-Webhook-Return if input is skip
    res.set('X-Watson-Assistant-Webhook-Return', 'yes');
    // Return a generic response that is send directly to the user
    return res.json({
      output: {
        generic: [
          {
            response_type: 'text',
            text: 'Response skipped by webhook'
          }
        ]
      }
    })
  }

  // Validate the JWT token (if provided)
  const token = req.headers.authorization;
  if (token && process.env.PRE_MESSAGE_SECRET) {
    try {
      jwt.verify(token, process.env.PRE_MESSAGE_SECRET);
      auth_result = 'JWT token verified';
    } catch (e) {
      if (token === process.env.PRE_MESSAGE_SECRET) {
        auth_result = 'Auth header matches secret value';
      
      } else {
        auth_result = `Invalid Auth Header value: ${token}`;
      }
    }
  }

  // Set the session variable
  if (!payload.context.skills) {
    payload.context.skills = {};
  }
  if (!payload.context.skills['actions skill']) {
    payload.context.skills['actions skill'] = {};
  }
  if (!payload.context.skills['actions skill'].skill_variables) {
    payload.context.skills['actions skill'].skill_variables = {};
  }
  payload.context.skills['actions skill'].skill_variables.pre_webhook_message = `${response_message}\n${auth_result}`;

  return res.json(req.body);
}

export function postWebhook(req, res) {
  const payload = req.body.payload;

  let response_message = 'Sample value from API Server (post-message)'
  let auth_result = 'No auth header provided'

  // Validate the JWT token (if provided)
  const token = req.headers.authorization;
  if (token && process.env.POST_MESSAGE_SECRET) {
    try {
      jwt.verify(token, process.env.POST_MESSAGE_SECRET);
      auth_result = 'JWT token verified';
    } catch (e) {
      if (token === process.env.POST_MESSAGE_SECRET) {
        auth_result = 'Auth header matches secret value';
      
      } else {
        auth_result = `Invalid Auth Header value: ${token}`;
      }
    }
  }

  // Set the session variable
  if (!payload.context.skills) {
    payload.context.skills = {};
  }
  if (!payload.context.skills['actions skill']) {
    payload.context.skills['actions skill'] = {};
  }
  if (!payload.context.skills['actions skill'].skill_variables) {
    payload.context.skills['actions skill'].skill_variables = {};
  }
  payload.context.skills['actions skill'].skill_variables.post_webhook_message = `${response_message}\n${auth_result}`;

  return res.json(req.body);
}

export function webhookErrorResponseNonJSON(req, res) {
  return res.send('Webhook non-JSON response');
}

export function webhookErrorTimeout(req, res) {
  // not sending response
}

export function webhookErrorCode(req, res) {
  let code = 500;

  try {
    const user_code = parseInt(req.params.http_code, 10);
    if (user_code >= 100 && user_code < 600) {
      code = user_code;
    }
  } catch (e) {
    // do nothing
    console.log(e);
  }

  return res.status(code).json({ error: 'Server Error', code });
}

