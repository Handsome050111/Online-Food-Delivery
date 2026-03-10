// @desc    Test REST API setup
// @route   GET /api/test
// @access  Public
const getTestMessage = (req, res) => {
    res.status(200).json({ message: 'API is working successfully!' });
};

module.exports = {
    getTestMessage
};
