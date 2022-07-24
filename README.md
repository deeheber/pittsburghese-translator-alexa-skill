# Hey-Yinz!-A-Pittsburghese-Translator

**Note: This repo has been archived and won't receive updates.**

![hey-yinz-sm108x108](https://user-images.githubusercontent.com/12616554/34074156-2cd923ca-e25e-11e7-8bec-23f2e9a089b6.png)

- [Mention](https://newsinteractive.post-gazette.com/blog/alexa-do-you-speak-pittsburghese/) in the news
- [Talk](https://www.youtube.com/watch?list=PLclEcT4yxER4dPvNgw8n-aQlcA1AtgrI2&v=77rk1uYzayM) at a local meetup

## Summary
Are you planning a visit to Pittsburgh or Western Pennsylvania and want to talk like the locals? If you answered yes, then this is the Alexa skill is for you!

This is a skill in which a user will say a word or phrase and Alexa will repeat that word or phrase back to the user in Pittsburghese if a Pittsburghese translation of the phrase exists...otherwise it will just repeat the phrase back to you.

Once a phrase is repeated back, the user has the option to repeat the phrase, repeat/slow down the phrase, or translate another phrase.

## Developer Notes
This skill was built using [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) and the [Alexa skill console](https://developer.amazon.com/alexa/console/ask)

### Deploy Instructions
1. Find your Alexa Skill Id in the Alexa skill console and [add it to the Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-cli.html#param-create-cli-string) as a String type in the region where you plan to deploy. Standard tier has worked well for me and is much more cost friendly.
2. Clone this repo.
3. Run `sam build` and `sam deploy --guided` commands.
4. You should now see a CloudFormation stack building with a DynamoDB table and a Lambda Function
5. Head to the Alexa skill console to set up your intents, build your model, and to connect your Lambda ARN to the skill. There's also a pretty nice GUI in there to test your skill before releasing it to the live Alexa Skill Store.

## Disclaimer
Not everyone who lives in or is originally from Western Pennsylvania actually talks like this.

[](https://user-images.githubusercontent.com/12616554/34074156-2cd923ca-e25e-11e7-8bec-23f2e9a089b6.png)
