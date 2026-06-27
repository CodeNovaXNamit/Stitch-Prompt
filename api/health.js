export default function handler(_request, response) {
  response.status(200).json({ success: true, status: 'ok' });
}
