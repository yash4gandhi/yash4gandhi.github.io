export const projects = [
  {
    "id": "financial-analyst",
    "title": "Multi-Agent Financial Report Analyst",
    "line": "Ask a financial question. Follow the evidence. Inspect the answer.",
    "category": "Agentic AI",
    "tags": "LangGraph · FastAPI · Next.js · retrieval",
    "summary": "A report-analysis application that coordinates specialized reasoning stages to turn questions about uploaded financial reports into cited answers and checked calculations.",
    "detail": "The router selects a calculation or narrative path. Retrieval supplies paragraphs and table rows; a planning agent builds a structured plan whose operands point to exact cells. A bounded Python Decimal engine executes allowed operations. Verification checks arithmetic, available units and year coverage, with expanded retrieval and bounded retries when checks fail. The frontend and FastAPI backend also support report overviews and usage accounting.",
    "outcome": "Built end to end across the interface, backend and agent workflow, and used with live models and uploaded reports. The result connects document understanding with inspectable evidence and reproducible arithmetic.",
    "limit": "Arithmetic checks validate the selected plan, not every semantic choice. Narrative verification checks evidence presence, not sentence-level entailment. PDF extraction is text based, without OCR.",
    "pub": [],
    "description": "Financial reports scatter important answers across tables, footnotes and narrative. This application brings report upload, question answering, source citations and PDF previews into one workflow. LangGraph coordinates routing, retrieval, planning and verification; deterministic tools handle calculations. Visitors can follow how evidence becomes an answer, including what happens when a check fails or a metric needs clarification.",
    "concepts": [
      [
        "Orchestration",
        "LangGraph controls which stage runs next and carries the question, evidence and intermediate results between stages."
      ],
      [
        "Retrieval",
        "Search locates relevant report text and table rows. Provenance keeps the answer connected to its source."
      ],
      [
        "Agents and tools",
        "Agents handle interpretation and structured planning. Calculation and arithmetic checks use bounded deterministic operations."
      ]
    ]
  },
  {
    "id": "tem-denoising",
    "title": "Seeing structure through noise",
    "line": "Computer vision, carried into a research workflow.",
    "category": "Computer vision",
    "tags": "Self-supervised learning · DnCNN · React · AWS",
    "summary": "Self-supervised denoising for Transmission Electron Microscopy (TEM), connected to a research portal for inspecting atomic structure.",
    "detail": "Recorrupted-to-Recorrupted (R2R), introduced by Pang and collaborators, constructs training pairs by adding controlled noise to noisy observations. A Denoising Convolutional Neural Network (DnCNN) learns the mapping under the method’s noise assumptions. The portal connects uploads to processing, SageMaker inference and reports containing denoised images and Fast Fourier Transform (FFT) analysis.",
    "outcome": "The portal was routinely used in the research workflow and reduced intensive manual image processing.",
    "limit": "Experimental images have no clean ground truth. Denoising supports interpretation; it does not establish that every apparent feature is physical.",
    "pub": [
      "tem"
    ],
    "description": "Transmission Electron Microscopy (TEM) uses electrons to reveal structures far smaller than visible-light microscopes can resolve. During an in-situ experiment, noise can obscure the changes researchers are trying to follow. This project combines a self-supervised denoising model with a React research portal, cloud inference and image-analysis reports. Sandia collaborators supplied the experimental data and materials interpretation, with a Los Alamos collaborator on the conference work.",
    "concepts": [
      [
        "TEM · Transmission Electron Microscopy",
        "A beam of electrons forms images of nanoscale and atomic structure. In-situ TEM follows a specimen while its conditions change."
      ],
      [
        "Self-supervised denoising",
        "The model learns from noisy observations rather than requiring an experimentally measured clean version of every image."
      ],
      [
        "FFT · Fast Fourier Transform",
        "An algorithm that converts the image into spatial-frequency information. Researchers inspect patterns associated with periodic crystal structure."
      ]
    ]
  },
  {
    "id": "peptide-design",
    "title": "Designing peptides with diffusion",
    "line": "Generate candidate peptides. Predict binding. Compare with experiments.",
    "category": "AI for science",
    "tags": "DDIM · CfC · PydanticAI · LangGraph",
    "summary": "Diffusion-based peptide generation and liquid-neural-network affinity prediction, connected through tools for researchers studying Bcl-xL binding.",
    "detail": "A Denoising Diffusion Implicit Model (DDIM) generates peptide encodings, which decode into amino-acid sequences. A Closed-form Continuous-time (CfC) neural network predicts binding free energy from the sequence. The research tools use PydanticAI for structured intent and LangGraph for routing into generation, direct CfC inference, or both. The explorer uses saved manuscript results, with each prediction paired to its actual sequence.",
    "outcome": "The published full-data experiment found 91.7% of tested generated peptides functional and 75% with stronger binding than the wild-type reference. More than 99% of generated sequences were novel relative to the training data. Experimental sample sizes and the separate smaller-data experiment are available in Study details.",
    "limit": "The saved affinity results come from the in-preparation manuscript. They are distinct from the later notebook’s aggregate evaluation; saved examples do not represent fresh inference.",
    "pub": [
      "peptide"
    ],
    "description": "Peptides are short chains of amino acids, and their sequence influences how they bind to a target protein. This research uses mRNA-display selection data to learn a family of Bcl-xL-binding peptides, generate new candidate sequences and estimate their binding affinity. Experimental collaborators synthesized and tested selected candidates. An agent extension connects researcher requests to generation and affinity-prediction tools.",
    "concepts": [
      [
        "DDIM · Denoising Diffusion Implicit Model",
        "Learns to remove noise from encoded examples and uses that learned process to generate new sequence encodings."
      ],
      [
        "CfC · Closed-form Continuous-time neural network",
        "A liquid neural-network model that processes a sequence with closed-form state updates. Here it predicts peptide binding affinity."
      ],
      [
        "Affinity · ΔG and Kd",
        "Binding free energy ΔG is reported in kcal/mol; more negative values indicate stronger binding under comparable conditions. The dissociation constant Kd is in molar units; lower values indicate tighter binding."
      ]
    ]
  },
  {
    "id": "alation-cms",
    "title": "One source for customer configuration",
    "line": "Infrastructure for a multitenant transition.",
    "category": "Software systems",
    "tags": "Django · gRPC · PostgreSQL · Redis",
    "summary": "An internal configuration management service for customer provisioning, tier changes and a transition to multitenant architecture.",
    "detail": "Internal clients accessed the service over gRPC. The implementation used Django, RDS/PostgreSQL, client/server Redis caching, an encryption microservice and Datadog.",
    "outcome": "Deployed and used by internal teams to centralize customer configuration access.",
    "limit": "The demonstration is a high-level reconstruction with fictional tenants. It does not claim exact cache invalidation, encryption sequencing or production scale.",
    "pub": [],
    "description": "Provisioning customers and changing subscription tiers require different internal services to agree on the same configuration. Built during an Alation internship, this service gives those clients a central place to retrieve and manage tenant-scoped settings. It was deployed for internal use and supported the transition from single-tenant to multitenant architecture."
  },
  {
    "id": "oil-forecasting",
    "title": "Learning changing production patterns",
    "line": "Long horizons. Nonstationary signals.",
    "category": "AI for science",
    "tags": "TimeGrad · Informer · LTC · time series",
    "summary": "Research into generative and sequence models for oil production forecasting across four multi-well sites.",
    "detail": "The 2024 preprint explores TimeGrad, a probabilistic forecasting approach based on diffusion, and Informer, a Transformer designed for long input sequences. A later manuscript explores Liquid Time-constant (LTC) networks alongside Informer and a vanilla Transformer. The figure explorer connects each site’s history to its model-specific prediction view.",
    "outcome": "Explored model behavior across BEAP, BEAT, EUAT and EUZE, including changing trends and intermittent production events.",
    "limit": "",
    "pub": [
      "oil"
    ],
    "description": "Oil production changes as reservoirs and operating conditions evolve. Forecasting must capture both the broader trend and sharp variations in output. This research explores sequence models across four multi-well production sites over roughly four decades. BEAP, BEAT, EUAT and EUZE are the site identifiers used in the data. Collaborators supplied production data and physics expertise; the computational work covered model implementation, training, evaluation and analysis.",
    "concepts": [
      [
        "LTC · Liquid Time-constant network",
        "A recurrent model whose internal state evolves in continuous time with adaptive time constants, allowing its response to change with the input."
      ],
      [
        "Informer",
        "A Transformer architecture for long-sequence forecasting. Sparse attention helps it process long histories and predict a future window. Informer is a model name."
      ],
      [
        "BEAP · BEAT · EUAT · EUZE",
        "Identifiers for the four oil-production sites in the study. Each site has its own history, fluctuations and changing production pattern."
      ]
    ]
  },
  {
    "id": "banking-assistant",
    "title": "Banking questions into structured queries",
    "line": "Language meets application engineering.",
    "category": "Agentic AI",
    "tags": "Dialogflow · Flask · webhooks · Pusher",
    "summary": "A conversational interface for transaction filters, balances, transaction status and card-limit questions.",
    "detail": "Intent and entity extraction maps questions to backend queries. The interface used jQuery/Bootstrap and Pusher delivery, with missing-slot help and a sentiment fallback.",
    "outcome": "Implemented conversational banking capabilities across language understanding, API integration and response delivery.",
    "limit": "",
    "pub": [],
    "description": "A customer might ask for recent transactions, filter payments by amount or date, or check a transaction’s status. This banking assistant translates those everyday questions into structured requests. Built at Empays, it connects Dialogflow language understanding to a Flask webhook backend and a web interface, with follow-up questions when essential information is missing."
  },
  {
    "id": "semantic-claims",
    "title": "WhatsApp Claim Checking with Semantic Search",
    "line": "Semantic retrieval, with its limits visible.",
    "category": "Agentic AI",
    "tags": "Sentence-BERT · semantic search · NLP",
    "summary": "A research pipeline that identifies claims in forwarded WhatsApp messages and retrieves related news for evidence inspection.",
    "detail": "The study used 1,000 consenting multilingual messages, 352 forwarded-message candidates and 105 filtered claims. A 3,800-article news corpus supported keyword overlap and Sentence-BERT cosine matching.",
    "outcome": "The paper reports 82 of 105 manually labeled claims correct (78.09%), with 17 false positives and 6 false negatives.",
    "limit": "Similarity is not proof of truth, and no retrieved match does not prove a claim false. The small study does not establish general-purpose fact-checking reliability.",
    "pub": [
      "claims"
    ],
    "description": "Forwarded WhatsApp messages often mix conversation, opinion and factual claims. This research first filters multilingual messages into candidate claims, then searches a news corpus for relevant reporting. Translation, claim filtering and Sentence-BERT embeddings connect message wording to semantically related articles. The study and paper were developed with coauthors; private message content is not included in the portfolio."
  },
  {
    "id": "english-assistant",
    "title": "Making speaking practice actionable",
    "line": "A question, an answer, a clearer next attempt.",
    "category": "Agentic AI",
    "tags": "Question generation · GECToR · speech features",
    "summary": "A speaking-practice workflow combining topic questions, transcription, grammar feedback and speech-feature reports.",
    "detail": "The published method describes SynQG and iterative RoBERTa/GECToR-style edits. Retained application code uses T5 question generation, an external grammar endpoint and Praat/Parselmouth features.",
    "outcome": "Connected practice prompts to phrase-level corrections and descriptive speech measurements.",
    "limit": "Grammar methods were reused, not invented here. Speech-to-text errors do not establish pronunciation errors, and speech measurements are not validated measures of confidence or emotion.",
    "pub": [
      "english"
    ],
    "description": "Speaking practice is more useful when feedback connects directly to an answer. This assistant turns a selected topic into questions, captures a spoken response, and brings together transcription, phrase-level grammar corrections and descriptive speech features. The research and implementation were developed with coauthors and evaluated informally by friends."
  },
  {
    "id": "methane-modeling",
    "title": "Modeling intermittent methane signals",
    "line": "Two data sources. Two different research tasks.",
    "category": "AI for science",
    "tags": "LTC · LSTM · CFD data · forecasting",
    "summary": "Offline ML research on field concentration time series and concentration evolution in CFD-generated data.",
    "detail": "A sensor in a canopy placed over a well records methane concentration over time. Computational Fluid Dynamics (CFD) separately simulates gas transport under specified conditions. Long Short-Term Memory (LSTM), Liquid Time-constant (LTC) and Feedforward Neural Network (FFN) results explore how learned models track concentration patterns. A surrogate model learns to approximate a simulation’s outputs; this study explores that direction rather than establishing a completed concentration-to-emission-rate conversion.",
    "outcome": "The study captured surge timing more effectively than magnitude. The field evidence spans approximately four operational hours at one well.",
    "limit": "This is offline research, not live monitoring. Source figure units and some model captions are inconsistent; no physical gas animation, broad generalization or surrogate speedup is claimed.",
    "pub": [
      "methane"
    ],
    "description": "Methane leakage from idle and abandoned wells can be intermittent, making isolated measurements difficult to interpret. This collaborative study combines a canopy sensor system, field measurements and computer-generated flow data with machine learning. One task forecasts changes in measured methane concentration; a second learns from fluid simulations to explore a faster way to approximate concentration evolution. Collaborators supplied field collection, sensing and physics simulation; the AI work analyzes those data offline.",
    "concepts": [
      [
        "Canopy, concentration and emissions",
        "The canopy provides a controlled collection geometry around the well. Concentration describes how much methane is present in the sampled gas; it is different from the mass emitted per unit time."
      ],
      [
        "CFD · Computational Fluid Dynamics",
        "Numerical simulation of fluid flow and gas transport. Its generated time series provide a separate source of model-training data from field measurements."
      ],
      [
        "LSTM · Long Short-Term Memory",
        "A recurrent neural network with memory gates for learning patterns across a sequence of observations."
      ],
      [
        "LTC · Liquid Time-constant network",
        "A continuous-time recurrent network whose adaptive dynamics respond to changing inputs."
      ],
      [
        "FFN · Feedforward Neural Network",
        "Maps an input representation to an output through successive layers, without a recurrent memory state."
      ],
      [
        "Reading the plots",
        "True/actual is the reference series; predicted is the model output. Timing and magnitude are different aspects of performance. ppm means parts per million; mol/m³ is molar concentration. Original source units are retained."
      ]
    ]
  },
  {
    "id": "tourist-guide",
    "title": "A place becomes a story",
    "line": "Recognition, information and nearby exploration.",
    "category": "Computer vision",
    "tags": "Android · CNN · Firebase · Smart India Hackathon",
    "summary": "A virtual tourist guide connecting landmark recognition with information, QR-linked guides and nearby navigation.",
    "detail": "The final demonstration included landmark identification, monument information, QR-linked text/audio, nearby attractions, recommendations, reviews and administrative updates. AR/VR and advertisements remained future scope.",
    "outcome": "The team demonstrated the discussed features for the Government of Goa problem DR135. Reported test-dataset accuracy was 92%; dataset size and class count are unavailable.",
    "limit": "This portfolio uses a real landmark photo and a prepared identification. A live recognition model is planned for a later iteration.",
    "pub": [],
    "description": "A visitor points a camera at a landmark and needs more than its name: useful background, a guide to what is inside and a way to explore nearby places. Built for the Government of Goa’s Smart India Hackathon problem, the Virtual Tourist Guide connects those steps in an Android application. Team CodeStrikers, led by Riya Bhagat, demonstrated recognition, information, recommendations and navigation alongside reviews and administrative features."
  },
  {
    "id": "stock-research",
    "title": "Stock Research & Paper Trading",
    "line": "Research a company. Track a watchlist. Practice a trade.",
    "category": "Software systems",
    "tags": "Angular · Flask · Android · GCP",
    "summary": "Three independently built implementations of stock lookup, news, watchlists and simulated trading.",
    "detail": "The projects used Finnhub for market information and news, Highcharts for visualizations and virtual buy/sell workflows.",
    "outcome": "Three implementations cover company lookup, financial news, charting, watchlists and paper-trading portfolio workflows. Explore the recordings above.",
    "limit": "Trades used simulated money. This portfolio does not fetch live prices or execute securities transactions.",
    "pub": [],
    "description": "A stock-research application brings company information, news and charts together with watchlists and a virtual portfolio. The workflow was implemented independently in Flask/AJAX, Angular and Android, exploring how the same product experience translates across web and mobile interfaces. Buying and selling used simulated money."
  },
  {
    "id": "ecommerce",
    "title": "Full-stack commerce foundations",
    "line": "A course implementation in the MEAN stack.",
    "category": "Software systems",
    "tags": "Angular · Express · MongoDB · JWT",
    "summary": "Full-stack practice connecting customer, product and order management.",
    "detail": "The supplied project description covers Angular management interfaces, a dashboard, Stripe, JWT, MongoDB and Express.",
    "outcome": "Full-stack implementation practice across frontend state, API integration, data persistence and authentication. A new website demo is planned for a future build.",
    "limit": "Course-based work. No production payment usage is claimed.",
    "pub": [],
    "description": "An Angular storefront and administrative application connected to an Express backend and MongoDB persistence. This course-based project practices the flow from browsing products to managing customers and orders, with authentication and payment integration in the supplied implementation. A new interactive storefront will be built as a separate iteration."
  }
];
export const publications = [
  {
    "id": "peptide",
    "project": "peptide-design",
    "title": "A Route to Design Novel Functional Peptides by Applying a Denoising Diffusional Model to mRNA Display Libraries",
    "authors": "Pearl Qi, Yash Pragnesh Gandhi, Kexin Zheng, Farzad Jalali-Yazdi, Justin N. Ong, Terry T. Takahashi, Rajiv K. Kalia, Richard W. Roberts",
    "venue": "ChemBioChem 26, e202500302",
    "year": "2025",
    "status": "Journal article",
    "url": "https://chemistry-europe.onlinelibrary.wiley.com/doi/10.1002/cbic.202500302"
  },
  {
    "id": "tem",
    "project": "tem-denoising",
    "title": "Deep Learning for Noise Reduction in High-Resolution In-Situ TEM",
    "authors": "Agus R. Poerwoprajitno, Yash Gandhi, C. Barry Carter, John Watt, Dale L. Huber, Rajiv K. Kalia",
    "venue": "Microscopy and Microanalysis 31, Supplement 1",
    "year": "2025",
    "status": "Conference abstract",
    "url": "https://academic.oup.com/mam/article/31/Supplement_1/ozaf048.1095/8212831"
  },
  {
    "id": "methane",
    "project": "methane-modeling",
    "title": "AI-Driven Computational Fluid Dynamic Simulations and Experiments to Predict Methane Emission: Applications to Idle and Abandoned Wells",
    "authors": "Nima Daneshvarjejad, Yash Pragnesh Gandhi, Rajiv Kalia, Young Cho, Donald Paul, Iraj Ershaghi",
    "venue": "SPE Western Regional · SPE-224163",
    "year": "2025",
    "status": "Conference paper",
    "url": "https://onepetro.org/SPEWRM/proceedings-abstract/25WRM/25WRM/D031S005R004/656780"
  },
  {
    "id": "oil",
    "project": "oil-forecasting",
    "title": "Generative AI-Driven Forecasting of Oil Production",
    "authors": "Yash Gandhi, Kexin Zheng, Birendra Jha, Ken-ichi Nomura, Aiichiro Nakano, Priya Vashishta, Rajiv K. Kalia",
    "venue": "arXiv:2409.16482",
    "year": "2024",
    "status": "Preprint",
    "url": "https://arxiv.org/abs/2409.16482"
  },
  {
    "id": "english",
    "project": "english-assistant",
    "title": "Virtual Assistant for Enhancing English Speaking Skills",
    "authors": "Ayushi Desai, Yash Gandhi, Jaynil Gaglani, Nikahat Mulla",
    "venue": "ICIRCA · pp. 800–806 · DOI 10.1109/ICIRCA51532.2021.9544877",
    "year": "2021",
    "status": "Conference paper",
    "url": "https://ieeexplore.ieee.org/document/9544877"
  },
  {
    "id": "claims",
    "project": "semantic-claims",
    "title": "Unsupervised WhatsApp Fake News Detection using Semantic Search",
    "authors": "Jaynil Gaglani, Yash Gandhi, Shubham Gogate, Aparna Halbe",
    "venue": "ICICCS · pp. 285–289",
    "year": "2020",
    "status": "Conference paper",
    "url": "https://ieeexplore.ieee.org/document/9120902"
  }
];
