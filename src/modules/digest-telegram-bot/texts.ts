export const texts = {
    'welcomeMessage': `
Hi there!

I'm <b>TLDRoid</b>, a Telegram bot designed to help you stay on top of large group conversations. With me, you'll be able to receive a daily or hourly digest of important messages, so you won't miss anything important.

Just send me the group ID or link and I'll take care of the rest.

<u>Supported IDs / links:</u>

@geeksChat
https://t.me/geeksChat
https://telegram.me/geeksChat

<u>Learn more</u>

use /help for a list of commands.
use /support to contact our support team for assistance with any issues or questions.
`,
    'supportMessage': `
Contact our support team for assistance with any issues or questions regarding the TLDRoid bot.

You can reach us via email at hello@dayoff.fun, or through Telegram by clicking this link https://t.me/tldroid_community.
`,

    'digestingChannel': 'Thank you, channel messages are now being processed and a summary will be sent to you shortly',

    'commands': {
        'helpDescription': 'Help',
        'supportDescription': 'Contact our support team for assistance with any issues or questions.'
    },

    'errors': {
        'general': 'Sorry, there was an error processing your digest request. Please try again later or contact /support if the issue persists.',
        'nonPublicChannel': 'Sorry, the TLDRoid bot only supports public channels. Please check that you have entered a valid public channel ID and try again.'
    }
};