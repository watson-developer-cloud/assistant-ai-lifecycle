# Multi-Assistant Routing with IBM watsonx Assistant
This directory contains sample code that can be used to build a multi-Assistant solution using IBM watsonx Assistant. This is needed by teams of IBM watsonx Assistant developers who wish to separate their content across multiple skills while making all the content accessible within a single user conversation.

A very detailed explanation of how this sample code works can be found at this [blog](). 

In this folder you will find the following:

- Primary (root) IBM watsonx Assistant Skill 
- Secondary Payment IBM watsonx Assistant Skill
- Secondary Support IBM watsonx Assistant Skill
- Node-RED Flow for pre-webhook for IBM watsonx Assistant 
- Node-RED Flow for post-webhook for IBM watsonx Assistant 

## Requirements
- Instance of Node-RED that is accessible on the public internet.
- A single instance of IBM watsonx Assistant. Go [here](https://cloud.ibm.com/catalog/services/watson-assistant) to get started.
- The above 5 files contained in this repo. 

## Message flow
This sequence diagram illustrates the basic overall flow of messages as they move between the pre and post webhooks and the three Assistants during a single conversation:
<p align="center">
  <img src="images/multi-assist-sequence-diagram.png">
</p>
The conversation shown here starts with the Primary Assistant and is then re-directed to the Secondary Assistant 2 where it stays for two conversation turns and then moves to Secondary Assistant 3 after no intent match is found at Secondary Assistant 2.


## Setup Instructions
Follow these steps to deploy this sample after you've cloned this repository to your local drive.

### Import the skills
1. Import the three Skills into a single IBM watsonx Assistant instance. 
2. Create 3 Assistants that correspond to each of these Skills.
3. From within each of these 3 Assistants go ahead and associate the 3 skills.

### Configure the Secondary Assistant URLs in the Primary Assistant
3. In the Primary Assistant Skill you will need to modify this context variable in the Support and Payment Dialog nodes to point at your associated Secondary Assistants: **multi_assist_url**
4. You can access the Secondary Assistant URLs in each of the assistants "Settings" panel by clicking the three dots on the associated Assistant card on the Assistants panel.

### Deploy the pre and post webhooks to Node-RED
5. Setting up a Node-RED instance is beyond the scope of this document but you can quickly setup a hosted Node-RED service instance in IBM cloud by following these [IBM Cloud Node-RED instructions](https://cloud.ibm.com/developer/appservice/create-app?starterKit=59c9d5bd-4d31-3611-897a-f94eea80dc9f&defaultLanguage=undefined) or if you prefer to stand up your on Node.js instance along with Node-RED you can follow these [Node-RED stand alone instructions](https://nodered.org/docs/getting-started/local). 
6. After you have a Node-RED instance running you will neeed to import the pre and post webhook Node-RED flows you cloned to your local drive.
7. Next copy the API_KEY associated with your IBM watsonx Assistant instance into a copy buffer. You can get to the API_KEY on any one of your Assistant "Settings" panels. The API_KEY is the same for every Assistant in your instance.
8. Go into the pre-webhook flow and open the "Pre Sub Message Request" and paste the API_KEY into the "Password" field for that node.
9. Go into the post-webhook flow and paste the same API_KEY into the "Password" field of both the "Sub Session Create" and the "Sub Message Request" nodes.

### Configure the Primary Assistant webhooks
10. Obtain the URLs that point to your pre-webhook and post-webhook flows running inside Node-RED. If you are using an IBM cloud instance of Node-RED this URL will be a combination of the root URL you use to access your Node-RED instance (the panel where you edit your flows) appended with either /multi-assist-pre-webhook or /multi-assist-post-webhook.
11. Next go into the Primary Assistant "Settings" and setup these two webhooks. Note that the secret is currently being ignored so you can set these to any value you wish. 

### Configure a channel integration for testing
12. This sample will work with any of the channel integrations but it was originally developed for the Phone channel. You can add a channel integration to your Primary Assistant by opening your Primary Assistant and then selecting the channel you wish to add from the Integrations section of the Assistant panel.
13. If the Phone channel is used you can create a free phone number to test your deployment. Note that free phone numbers are currently only available in the US so you may need to go with a different channel integration if you are outside the US. 

## Testing
At this point you should have everyting setup and ready to test. The assumption here is that you setup a new phone channel for testing with a free phone number. Start by using the free phone number to call the Primary Assistant.

You can then use the following script to test your assistant:

1. Primary Assistant greets you and provides a list of options to select from including "support" and "payments".
2. Say "payments".
3. The Payments Assistant then responds in a different voice with a greeting.
4. Now say "I meant to ask for support".
5. The Support Assistant then responds in a different voice with a greeting.
6. Now say "Back to the top please".
7. The Primary Assistant now repeats the list of supported options.
8. Say "support" again.
9. The Support Assistant greets you again.
10. Now say "I need help with my mobile app".
11. Support Assistant ask you to state your problem.
12. Hangup the call.

You're done! At this point you have setup the complete solution and tested the solution by switching between all 3 Assistants.

## Next Steps
You can now customize this sample to support whatever use case you need. Assuming you have already configured Assistants for all your secondary skills, the only things that need to change are:

1. The nodes in the Primary Assistant that map to your secondary skills.
2. The **multi_assist_url** context variables that point to those secondary skills.
3. Intent training for the intents that point to your secondary skills.
4. Modify the anything_else nodes in your secondary skills to include this context variable: **multi_assist_no_match**.

## Converting the Node-RED samples to run on a different runtime

Its very likely that for production deployments you may wish to convert the Node-RED samples to run on some other runtime. To make this easier here are several examples of messages that can be returned from both a pre and post webhook. Note that the next section shows the difference between returning a message response vs. a message request from a pre-webhook, which is the new feature described in the blog related to this code sample.

### Pre-webhook message response

Please note that there is no root "payload" object when a response is returned from the pre-webhook instead of a request.

```json
{
	"output": {
		"intents": [{
			"intent": "OnlineBanking",
			"confidence": 0.28619351983070374
		}],
		"entities": [],
		"generic": [{
			"response_type": "text",
			"text": "Please describe the issue you are having."
		}]
	},
	"user_id": "88c38df9ea94edc55eb9467fc3fef707",
	"context": {
		"global": {
      "session_id": "b263cb6f-0d62-4b01-a28e-1743ff54d28d",
			"system": {
				...
			}
		},
		"skills": {
			"main skill": {
				"user_defined": {
					"multi_assist_url": "https://api.us-east.assistant.watson.cloud.ibm.com/instances/xxxxxxx-fff9-4840-ac91-6cacfe609b37/v2/assistants/xxxxxxxx-bbb2-4903-b5e1-aad940870277/sessions",
					"multi_assist_session_id": "80a8f8a6-a853-4edc-97ba-bf31f6b219ad",
          ...
				},
				"system": {}
			}
		},
		"integrations": {
			"voice_telephony": {
				"private": {
					...
				},
				"sip_call_id": "54670605_117221660@10.190.42.210",
				"assistant_phone_number": "+12024172419"
			}
		}
	}
}
```

### Pre-webhook message request

```json
{
	"payload": {
		"input": {
			"message_type": "text",
			"text": "support",
			"source": {
				"type": "user",
				"id": "88c38df9ea94edc55eb9467fc3fef707"
			},
			"options": {
				"suggestion_only": false,
				"return_context": true
			},
			"integrations": {
				"voice_telephony": {
					"speech_to_text_result": {
						...
					},
					"is_dtmf": false,
					"barge_in_occurred": true
				}
			}
		},
		"context": {
			"global": {
				"system": {
					"user_id": "88c38df9ea94edc55eb9467fc3fef707",
					"session_start_time": "2021-10-20T19:35:27.052Z",
					"state": "..."
				},
				"session_id": "b263cb6f-0d62-4b01-a28e-1743ff54d28d"
			},
			"integrations": {
				"voice_telephony": {
					"sip_call_id": "2398068_134177627@10.213.75.14",
					"assistant_phone_number": "+12024172419",
					"private": {
						...
					}
				}
			},
			"skills": {
				"main skill": {
					"user_defined": {
						...
						"multi_assist_orig_session_id": "b263cb6f-0d62-4b01-a28e-1743ff54d28d"
					},
					"system": {}
				}
			}
		}
	}
}
```

### Post-webhook message response

```json
{
	"payload": {
		"output": {
			"intents": [],
			"entities": [],
			"generic": [{
				"response_type": "text",
				"text": "Hello. You've reached support. How can I help you?"
			}]
		},
		"user_id": "88c38df9ea94edc55eb9467fc3fef707",
		"context": {
			"global": {
				"system": {
					...
				},
				"session_id": "b263cb6f-0d62-4b01-a28e-1743ff54d28d"
			},
			"skills": {
				"main skill": {
					"user_defined": {
						"multi_assist_url": "https://api.us-east.assistant.watson.cloud.ibm.com/instances/xxxxxxx-fff9-4840-ac91-6cacfe609b37/v2/assistants/xxxxxxxx-bbb2-4903-b5e1-aad940870277/sessions",
						"multi_assist_session_id": "8b9a44a4-eb21-4c4d-bbc6-6550d475a137",
						...
					},
					"system": {}
				}
			}
		}
	}
}
```
