import time
from openai import OpenAI
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def call_openai_api(content , apiKey):
 ASSISTANT_ID = "asst_rVUaSLlNsAUf7k6KM1JgVRVS"
 client = OpenAI(api_key=apiKey)
# Create a thread with a message.
 thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content" : content
            # Update this with the query you want to use.
            # "content": "https://i2-prod.walesonline.co.uk/incoming/article21362521.ece/ALTERNATES/s615b/0_Blake-24-Cardiff-RadiographerJPG.jpg",
        }
    ]
)

# Submit the thread to the assistant (as a new run).
 run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)

 while run.status != "completed":
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

 message_response = client.beta.threads.messages.list(thread_id=thread.id)
 messages = message_response.data

 latest_message = messages[0]
 json_string = latest_message.content[0].text.value
 json_data = json.loads(json_string)

 return json_data

def rewrite_bio_api(content , apiKey):
 ASSISTANT_ID = "asst_T6iPATDT8ZqbuyInlOQcKjp0"
 client = OpenAI(api_key=apiKey)
# Create a thread with a message.
 thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content" : content
            # Update this with the query you want to use.
            # "content": "https://i2-prod.walesonline.co.uk/incoming/article21362521.ece/ALTERNATES/s615b/0_Blake-24-Cardiff-RadiographerJPG.jpg",
        }
    ]
)

# Submit the thread to the assistant (as a new run).
 run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)

 while run.status != "completed":
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

 message_response = client.beta.threads.messages.list(thread_id=thread.id)
 messages = message_response.data

 latest_message = messages[0]
 json_string = latest_message.content[0].text.value
 json_data = json.loads(json_string)

 return json_data


@app.route('/process', methods=['POST'])
def process_data():
  data = request.get_json()
  content = data.get('content')
  apiKey = data.get('apiKey')

    # Ensure content is provided
  if not content:
   return jsonify({"error": "No content provided"}), 400

    # Call the OpenAI API and get the response
  result = call_openai_api(content , apiKey)

    # Return the result as a JSON response
  return jsonify(result)

@app.route('/rewrite', methods=['POST'])
def process_data_new():
  data = request.get_json()
  content = data.get('content')
  apiKey = data.get('apiKey')

    # Ensure content is provided
  if not content:
   return jsonify({"error": "No content provided"}), 400

    # Call the OpenAI API and get the response
  result = rewrite_bio_api(content , apiKey)

    # Return the result as a JSON response
  return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)






