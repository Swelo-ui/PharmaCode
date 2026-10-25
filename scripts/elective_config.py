# scripts/elective_config.py
# All 8 Elective parent courses and their 32 options with exact page ranges from Appendix I

ELECTIVE_GROUPS = [
    {
        "sem": 2,
        "parent_code": "BP212P SEC",
        "name": "SEC Elective — Communication Skills / Mental Well-Being / Basic Computer Operations (Practical)",
        "credits": 1,
        "type": "P",
        "options": [
            {"code": "BP212P SEC1", "title": "Communication Skills", "start": 272, "end": 273, "type": "P", "hours": "30 Hours"},
            {"code": "BP212P SEC2", "title": "Mental Well-Being, Stress & Conflict Management", "start": 274, "end": 275, "type": "P", "hours": "30 Hours"},
            {"code": "BP212P SEC3", "title": "Basic Computer Operations & Information Technology", "start": 276, "end": 277, "type": "P", "hours": "30 Hours"},
        ]
    },
    {
        "sem": 3,
        "parent_code": "BP312P AEC",
        "name": "AEC Elective — Nutraceuticals / Food Analysis / Yoga & Life Sciences (Practical)",
        "credits": 1,
        "type": "P",
        "options": [
            {"code": "BP312P AEC1", "title": "Nutraceuticals and Functional Foods", "start": 278, "end": 279, "type": "P", "hours": "30 Hours"},
            {"code": "BP312P AEC2", "title": "Food Analysis", "start": 280, "end": 281, "type": "P", "hours": "30 Hours"},
            {"code": "BP312P AEC3", "title": "Yoga and Life Sciences", "start": 282, "end": 283, "type": "P", "hours": "30 Hours"},
        ]
    },
    {
        "sem": 6,
        "parent_code": "BP607T AEC",
        "name": "AEC Elective — Green Chemistry / Materiovigilance / Scientific Writing / Drug Store Management / Medicinal Plant Cultivation / API Sciences",
        "credits": 1,
        "type": "T",
        "options": [
            {"code": "BP607T AEC1", "title": "Green Chemistry", "start": 284, "end": 285, "type": "T", "hours": "15 Hours"},
            {"code": "BP607T AEC2", "title": "Materiovigilance and Hemovigilance", "start": 286, "end": 288, "type": "T", "hours": "15 Hours"},
            {"code": "BP607T AEC3", "title": "Scientific Writing", "start": 289, "end": 290, "type": "T", "hours": "15 Hours"},
            {"code": "BP607T AEC4", "title": "Drug Store and Business Management", "start": 291, "end": 292, "type": "T", "hours": "15 Hours"},
            {"code": "BP607T AEC5", "title": "Career Building in Cultivation of Medicinal Plants", "start": 293, "end": 294, "type": "T", "hours": "15 Hours"},
            {"code": "BP607T AEC6", "title": "Active Pharmaceutical Ingredients and Excipient Sciences", "start": 295, "end": 296, "type": "T", "hours": "15 Hours"},
        ]
    },
    {
        "sem": 6,
        "parent_code": "BP610P SEC",
        "name": "SEC Elective — Computer-Aided Drug Design / Analytical Method Development / Principles of Preclinical Studies (Practical)",
        "credits": 1,
        "type": "P",
        "options": [
            {"code": "BP610P SEC1", "title": "Computer-Aided Drug Design", "start": 297, "end": 299, "type": "P", "hours": "30 Hours"},
            {"code": "BP610P SEC2", "title": "Analytical Method Development and Validation", "start": 300, "end": 301, "type": "P", "hours": "30 Hours"},
            {"code": "BP610P SEC3", "title": "Principles of Preclinical Studies", "start": 302, "end": 303, "type": "P", "hours": "30 Hours"},
        ]
    },
    {
        "sem": 6,
        "parent_code": "BP611P VAC",
        "name": "VAC Elective — Professional Skills / Process Analytical Technology & Quality by Design (Practical)",
        "credits": 1,
        "type": "P",
        "options": [
            {"code": "BP611P VAC1", "title": "Professional Skills", "start": 304, "end": 305, "type": "P", "hours": "30 Hours"},
            {"code": "BP611P VAC2", "title": "Process Analytical Technology & Quality by Design", "start": 306, "end": 307, "type": "P", "hours": "30 Hours"},
        ]
    },
    {
        "sem": 7,
        "parent_code": "BP708T AEC",
        "name": "AEC Elective — Current Good Manufacturing Practices / Pharmaceutical Automation / Cellular Biology / Medical Devices / Food Waste Products / Biosimilars",
        "credits": 1,
        "type": "T",
        "options": [
            {"code": "BP708T AEC1", "title": "Current Good Manufacturing Practices (cGMP)", "start": 308, "end": 309, "type": "T", "hours": "15 Hours"},
            {"code": "BP708T AEC2", "title": "Pharmaceutical Automation", "start": 310, "end": 312, "type": "T", "hours": "15 Hours"},
            {"code": "BP708T AEC3", "title": "Modern Techniques in Cellular Biology", "start": 313, "end": 314, "type": "T", "hours": "15 Hours"},
            {"code": "BP708T AEC4", "title": "Medical Devices", "start": 315, "end": 317, "type": "T", "hours": "15 Hours"},
            {"code": "BP708T AEC5", "title": "Transformation of Food Waste into Medicinal Products", "start": 318, "end": 319, "type": "T", "hours": "15 Hours"},
            {"code": "BP708T AEC6", "title": "Biosimilars, Vaccines & Macromolecules", "start": 320, "end": 323, "type": "T", "hours": "15 Hours"},
        ]
    },
    {
        "sem": 8,
        "parent_code": "BP806T AEC",
        "name": "AEC Elective — Pharmaceutical Packaging / Supply Chain / Industrial Safety / Traditional Healing / AR-VR Pharma 4.0 / Herbal Cosmetics",
        "credits": 2,
        "type": "T",
        "options": [
            {"code": "BP806T AEC1", "title": "Pharmaceutical Packaging", "start": 324, "end": 326, "type": "T", "hours": "30 Hours"},
            {"code": "BP806T AEC2", "title": "Supply Chain Management", "start": 327, "end": 329, "type": "T", "hours": "30 Hours"},
            {"code": "BP806T AEC3", "title": "Industrial Safety and Waste Management", "start": 330, "end": 331, "type": "T", "hours": "30 Hours"},
            {"code": "BP806T AEC4", "title": "Traditional Healing Practices of India", "start": 332, "end": 334, "type": "T", "hours": "30 Hours"},
            {"code": "BP806T AEC5", "title": "Futuristic Pharma through AR/VR: Pharma 4.0", "start": 335, "end": 337, "type": "T", "hours": "30 Hours"},
            {"code": "BP806T AEC6", "title": "Herbal Cosmetics for Industry Perspective", "start": 338, "end": 340, "type": "T", "hours": "30 Hours"},
        ]
    },
    {
        "sem": 8,
        "parent_code": "BP809P VAC",
        "name": "VAC Elective — Cleaning Validation / Basic Training in Aseptic Handling Techniques / Impurity Profiling (Practical)",
        "credits": 1,
        "type": "P",
        "options": [
            {"code": "BP809P VAC1", "title": "Cleaning Validation", "start": 341, "end": 342, "type": "P", "hours": "30 Hours"},
            {"code": "BP809P VAC2", "title": "Basic Training in Aseptic Handling Techniques", "start": 343, "end": 344, "type": "P", "hours": "30 Hours"},
            {"code": "BP809P VAC3", "title": "Impurity Profiling", "start": 345, "end": 346, "type": "P", "hours": "30 Hours"},
        ]
    },
]
