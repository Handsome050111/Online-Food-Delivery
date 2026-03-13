const contactController = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and message' });
        }

        // In a real application, you would send an email here or store it in a database
        console.log(`Contact request received from ${name} (${email}): ${message}`);

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been received! We will get back to you soon.' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { contactController };
