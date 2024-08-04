//Function to format the message that the backend JOI validator sends
export function formatMessage(result: string) {
  let formattedMessage = result.replace(/[^a-zA-Z0-9\s.]/g, "");
  formattedMessage =
    formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1);
  return formattedMessage;
}
