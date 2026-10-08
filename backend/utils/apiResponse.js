// Keeps every API response in the same shape, so the frontend can always
// check `success` and read `data` or `message` the same way regardless of
// which endpoint it called.

function success(res, data = {}, message = "Request successful", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function error(res, message = "Something went wrong", status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
