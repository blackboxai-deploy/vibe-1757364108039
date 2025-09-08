"use client";

import React, { useState } from 'react';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: '🎤 Hello! I am your voice-enabled AI assistant for SKV Global Business Service LLC. You can:\n\n• Record voice messages (click 🎤)\n• Upload documents (📄 tab)\n• Listen to my responses (click 🔈)\n• Contact our global team!\n\nOffices: 🇭🇺 Hungary | 🇬🇧 London | 🇦🇪 Dubai\n\nHow can I help you today?',
      hasVoice: true,
      timestamp: new Date(),
      isVoiceMessage: false
    }
  ]);

  // VOICE RECORDING FUNCTIONS
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices) {
        alert('Voice recording not supported in this browser. Please try Chrome or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Record for maximum 10 seconds
      setTimeout(() => {
        stopVoiceRecording();
        stream.getTracks().forEach(track => track.stop());
      }, 10000);
      
    } catch (error) {
      alert('Please allow microphone access to use voice messages');
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    
    // Simulate voice-to-text conversion
    setTimeout(() => {
      const voiceMessages = [
        "I need help with tourist visa for my family trip to Europe",
        "What documents are required for UK company registration?", 
        "I want to set up a business in Dubai, please provide information",
        "Need tax filing assistance for my international business",
        "Legal consultation required for partnership agreement",
        "How much does business visa cost for London?",
        "I want to upload my passport documents for processing"
      ];
      
      const randomMessage = voiceMessages[Math.floor(Math.random() * voiceMessages.length)];
      
      // Add voice message to chat
      const voiceUserMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: randomMessage,
        hasVoice: true,
        timestamp: new Date(),
        isVoiceMessage: true
      };
      setMessages(prev => [...prev, voiceUserMessage]);
      
      // Process the voice message
      setTimeout(() => {
        handleSendMessage(randomMessage);
      }, 1000);
    }, 2000);
  };

  // TEXT-TO-SPEECH FUNCTION
  const speakResponse = (messageId: string, text: string) => {
    if (!window.speechSynthesis) {
      alert('Audio playback not supported in this browser');
      return;
    }

    if (isPlaying === messageId) {
      window.speechSynthesis.cancel();
      setIsPlaying('');
      return;
    }

    setIsPlaying(messageId);
    
    // Clean text for better speech
    const cleanText = text
      .replace(/[🛂💰🇬🇧⚖️🤖📧📄🎤🇭🇺🇦🇪•\*]/g, '')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, '. ')
      .replace(/Contact Expert:/g, 'Contact our expert ')
      .replace(/Services & Pricing:/g, 'Our services and pricing include ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    
    utterance.onend = () => {
      setIsPlaying('');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // DOCUMENT UPLOAD FUNCTIONS
  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(i);
    }
    
    // Add files to uploaded list
    const newFiles = Array.from(files as FileList).map((file: File, index: number) => ({
      id: (Date.now() + index).toString(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      uploadDate: new Date(),
      category: getDocumentCategory(file.name),
      status: 'uploaded'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
    setUploadProgress(0);
    
    // Add upload confirmation message
    const uploadMessage = {
      id: (Date.now() + 2000).toString(),
      type: 'ai',
      content: `📄 **DOCUMENTS SUCCESSFULLY UPLOADED**

${newFiles.length} document(s) uploaded to SKV Global Cloud:

${newFiles.map((file: any) => `• ${file.name} (${file.size}) - ${file.category}`).join('\n')}

**Global Access Locations:**
🇭🇺 Hungary Office - European processing
🇬🇧 London Office - UK & Commonwealth
🇦🇪 Dubai Office - Middle East & Asia

**Security Features:**
• Enterprise-grade encryption
• Automatic backup across all offices  
• Download access from anywhere
• Expert team can access for processing

Your documents are now safely stored in our global cloud system!`,
      hasVoice: true,
      timestamp: new Date(),
      isVoiceMessage: false
    };
    
    setMessages(prev => [...prev, uploadMessage]);
  };

  const getDocumentCategory = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('passport')) return 'Passport Documents';
    if (name.includes('visa')) return 'Visa Applications';
    if (name.includes('license')) return 'Business License';
    if (name.includes('tax') || name.includes('gst')) return 'Tax Documents';
    if (name.includes('legal') || name.includes('contract')) return 'Legal Documents';
    if (name.includes('bank') || name.includes('finance')) return 'Financial Documents';
    if (name.includes('photo') || name.includes('image')) return 'Photographs';
    return 'General Documents';
  };

  const handleSendMessage = (messageText = chatInput) => {
    if (!messageText.trim()) return;
    
    // Add user message if typing (not voice)
    if (chatInput === messageText) {
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: messageText,
        hasVoice: false,
        timestamp: new Date(),
        isVoiceMessage: false
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Enhanced AI responses
    let aiResponse = '';
    const input = messageText.toLowerCase();
    
    if (input.includes('visa') || input.includes('passport')) {
      aiResponse = `🛂 **VISA SERVICES**

**Contact Expert: Rahul**
📧 rahul@skvbusiness.com
🌐 visa.skvbusiness.com

**Global Visa Processing:**
• Tourist Visa: $299-599 (7-15 days processing)
• Business Visa: $399-899 (10-21 days processing) 
• Student Visa: $199-499 (15-30 days processing)
• Work Permits: $499-999 (20-45 days processing)

**Required Documents:**
• Valid passport (minimum 6 months validity)
• Recent passport photographs (2x2 inches)
• Bank statements (last 3-6 months)
• Travel itinerary or invitation letter
• Travel insurance coverage proof

**Global Office Network:**
🇭🇺 **Hungary Office** - European visa processing
🇬🇧 **London Office** - UK & Commonwealth visas  
🇦🇪 **Dubai Office** - Middle East & Asian visas

**Rahul's Expertise:**
• 150+ countries visa processing
• 10+ years international experience
• 95% approval success rate
• Express processing available

**Contact Rahul now: rahul@skvbusiness.com**`;
    } else if (input.includes('tax') || input.includes('gst') || input.includes('filing')) {
      aiResponse = `💰 **TAX SERVICES**

**Contact Expert: Mohit**
📧 mohit@skvbusiness.com
🌐 tax.skvbusiness.com

**Complete Tax Solutions:**
• Tax Registration & Filing: $149-499
• GST Registration & Returns: $199-599
• International Tax Planning: $299-899
• Corporate Tax Strategy: $399-1299
• Cross-border Tax Optimization: $499-1599

**Global Tax Expertise:**
🇭🇺 **Hungary Office** - European tax laws & EU compliance
🇬🇧 **London Office** - UK tax system & HMRC liaison
🇦🇪 **Dubai Office** - UAE tax regulations & VAT

**Mohit's Specialization:**
• 12+ years certified tax advisor
• Multi-jurisdictional tax knowledge
• International business taxation
• Government compliance expert

**Special Services:**
• Free initial consultation (30 minutes)
• Multi-currency tax handling
• Quarterly tax review meetings

**Contact Mohit now: mohit@skvbusiness.com**`;
    } else if (input.includes('uk') || input.includes('london') || input.includes('europe') || input.includes('european')) {
      aiResponse = `🇬🇧 **EUROPEAN & LONDON BUSINESS SETUP**

**Contact Expert: Nikita**
📧 nikita@skvbusiness.com
🌐 europe.skvbusiness.com

**UK & European Services:**
• UK Limited Company Setup: £299-899
• EU Business Registration: €399-1299
• London Office Establishment: £599-1999
• European Banking Solutions: €299-899
• VAT Registration (UK/EU): £149-399

**Global European Network:**
🇭🇺 **Hungary Office** - EU headquarters & operations
🇬🇧 **London Office** - Direct UK presence & support
🇦🇪 **Dubai Office** - Europe-Middle East bridge

**Nikita's Expertise:**
• UK Companies House certified agent
• EU business regulations specialist
• London commercial property expert
• Post-Brexit compliance advisor

**Complete Setup Packages:**
• **London Startup:** £899 (Company + Bank + Office)
• **EU Business:** €1299 (Registration + VAT + Compliance)

**Contact Nikita now: nikita@skvbusiness.com**`;
    } else if (input.includes('dubai') || input.includes('uae') || input.includes('middle east')) {
      aiResponse = `🇦🇪 **DUBAI & MIDDLE EAST OPERATIONS**

**SKV Global Dubai Office**
📧 info@skvbusiness.com
🌐 dubai.skvbusiness.com

**UAE Business Services:**
• UAE Company Formation: AED 2,999-9,999
• Dubai Business License: AED 1,999-6,999
• UAE Bank Account Opening: AED 2,499-7,999
• Dubai Office Setup: AED 3,999-15,999
• UAE Visa Processing: AED 999-3,999

**Middle East Expertise:**
• Dubai mainland business setup
• UAE Free Zone companies
• Abu Dhabi commercial registration
• Sharjah business establishment
• Saudi Arabia market entry

**Dubai Office Advantages:**
🇦🇪 **Local UAE expertise & government relations**
🇭🇺 **European business connection**
🇬🇧 **UK business bridge**

**Why Choose Our Dubai Office:**
• Local Emirati business advisors
• Government liaison services  
• Fast processing (3-7 days setup)
• Arabic & English support
• Multi-emirate coverage

**Contact our Dubai specialists: info@skvbusiness.com**`;
    } else if (input.includes('document') || input.includes('upload') || input.includes('file')) {
      aiResponse = `📄 **GLOBAL DOCUMENT MANAGEMENT**

**Upload Documents From Anywhere:**
• Airport terminals worldwide
• Hungary office locations
• London office premises  
• Dubai office facilities
• Home/remote locations
• Mobile devices

**Document Types Supported:**
• Passport & Identity documents
• Visa applications & supporting docs
• Business licenses & permits
• Tax documents & financial statements
• Legal contracts & agreements
• Educational certificates
• Medical documents & reports
• Bank statements & financial proof

**Cloud Storage Features:**
• **Security:** Military-grade encryption
• **Access:** Available from all 3 global offices
• **Backup:** Automatic multi-location backup
• **Download:** Anytime, anywhere access
• **Categorization:** Smart auto-sorting
• **Alerts:** Expiry date notifications

**Global Office Access:**
🇭🇺 **Hungary Office** - European document processing
🇬🇧 **London Office** - UK document verification
🇦🇪 **Dubai Office** - Middle East document handling

**Storage Pricing (Pay-as-you-use):**
• First 2GB: FREE
• 2-10GB: $3/month
• 10-50GB: $12/month
• 50GB+: $25/month

**Upload your documents using the Document Center tab!**`;
    } else if (input.includes('legal') || input.includes('advisory') || input.includes('contract')) {
      aiResponse = `⚖️ **LEGAL & ADVISORY SERVICES**

**Contact Expert: Sunil (CEO)**
📧 sunil@skvbusiness.com
🌐 legal.skvbusiness.com

**Legal Services:**
• Legal Consultation: $149-499
• Contract Review & Drafting: $199-899
• Business Registration: $299-1299
• Compliance Auditing: $299-999
• Dispute Resolution: $499-1999

**Strategic Advisory:**
• Business Strategy Development: $299-1299
• International Expansion: $599-2499
• Corporate Restructuring: $899-3999

**Global Legal Coverage:**
🇭🇺 **Hungary Office** - European business law
🇬🇧 **London Office** - UK commercial law  
🇦🇪 **Dubai Office** - Middle East business law

**Sunil's Expertise:**
• 15+ years international business law
• CEO of SKV Global with operational experience
• Multi-jurisdictional legal practice
• Strategic business development focus

**Contact CEO Sunil: sunil@skvbusiness.com**`;
    } else {
      aiResponse = `🤖 **SKV GLOBAL AI ASSISTANT**

Welcome to our advanced business platform!

**🌍 GLOBAL EXPERT TEAM:**
🛂 **Visa & Licenses** → rahul@skvbusiness.com
💰 **Tax Services** → mohit@skvbusiness.com  
🇬🇧 **European & London Setup** → nikita@skvbusiness.com
⚖️ **Legal & Advisory** → sunil@skvbusiness.com

**🌍 GLOBAL OFFICE NETWORK:**
🇭🇺 **Hungary Office** - European operations & EU compliance
🇬🇧 **London Office** - UK & Commonwealth services
🇦🇪 **Dubai Office** - Middle East & Asian expansion

**🎤 PLATFORM FEATURES:**
• Voice messaging (record & playback)
• Document upload & global cloud storage
• AI expert routing & recommendations
• Multi-language support
• Mobile-optimized interface
• 24/7 availability

**📄 DOCUMENT SERVICES:**
• Secure upload from any location
• Global office access
• Expert team processing
• Download anytime functionality

**How can I assist you today?**
Use voice recording, type questions, or upload documents!`;
    }
    
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        hasVoice: true,
        timestamp: new Date(),
        isVoiceMessage: false
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 2000);
    
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HEADER WITH DUBAI OFFICE */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SKV Global Business Service LLC</h1>
                <p className="text-sm text-slate-600 font-medium">🌍 Hungary | London | Dubai | Worldwide</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                🎤 Voice Enabled
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                📄 Document Upload
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                🤖 AI Support
              </span>
              <button 
                className="bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => window.open('mailto:info@skvbusiness.com')}
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION WITH DOCUMENT CENTER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('chat')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'chat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              💬 AI Assistant
            </button>
            <button
              onClick={() => setActiveSection('services')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'services' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🏢 Our Services
            </button>
            <button
              onClick={() => setActiveSection('documents')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📄 Document Center
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* AI ASSISTANT WITH VOICE & UPLOAD */}
        {activeSection === 'chat' && (
          <div className="space-y-6">
            {/* Enhanced Features Banner */}
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-green-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">🎤</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Voice Messages & Document Upload</h3>
                      <p className="text-sm text-slate-600">Record voice messages, listen to responses, and upload documents to global cloud!</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🎤 Voice Input</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🔈 Audio Output</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">📄 File Upload</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">☁️ Global Cloud</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VOICE & DOCUMENT CHAT INTERFACE */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
              <div className="p-6">
                
                {/* Chat Messages Area */}
                <div className="h-[400px] overflow-y-auto space-y-4 mb-6 border rounded-lg p-4 bg-slate-50">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-slate-900 border border-slate-200'
                      }`}>
                        {message.type === 'ai' && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">🤖</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">SKV AI Assistant</span>
                            {message.hasVoice && (
                              <button
                                onClick={() => speakResponse(message.id, message.content)}
                                className={`ml-2 p-2 rounded-full transition-all shadow-sm ${
                                  isPlaying === message.id 
                                    ? 'bg-green-200 text-green-800 animate-pulse shadow-md' 
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                                title={isPlaying === message.id ? 'Stop Audio Playback' : 'Play Audio Response'}
                              >
                                <span className="text-sm font-bold">
                                  {isPlaying === message.id ? '🔊' : '🔈'}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                        
                        {message.type === 'user' && message.isVoiceMessage && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs bg-blue-800 text-white px-2 py-1 rounded-full font-medium">🎤 Voice Message</span>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                        <div className="mt-3 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Buttons */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Quick Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Tourist visa for Europe trip',
                      'UK company setup cost?',
                      'Dubai business license help', 
                      'Tax filing deadlines?',
                      'Legal consultation pricing',
                      'Upload my documents'
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(question)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-full border border-blue-200 transition-all hover:shadow-md"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Quick Access */}
                <div className="mb-4 p-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors bg-purple-50/30">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.txt"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="quick-file-upload"
                  />
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-2xl">📁</div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900">Quick Document Upload</p>
                      <p className="text-xs text-slate-600">Drag files here or click to browse</p>
                    </div>
                    <button
                      onClick={() => document.getElementById('quick-file-upload')?.click()}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                    >
                      📄 Choose Files
                    </button>
                  </div>
                </div>

                {/* Voice Recording Status */}
                {isRecording && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-red-700 font-semibold">🎤 Recording voice message... (max 10 seconds)</span>
                      </div>
                      <button
                        onClick={stopVoiceRecording}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                      >
                        ⏹️ Stop Recording
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-purple-700 font-medium">📤 Uploading to SKV Global Cloud...</span>
                      <div className="flex-1 bg-purple-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-purple-700 font-bold">{uploadProgress}%</span>
                    </div>
                  </div>
                )}

                {/* INPUT AREA WITH VOICE */}
                <div className="flex space-x-3">
                  {/* Voice Recording Button */}
                  <button
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`p-4 rounded-lg transition-all shadow-lg ${
                      isRecording 
                        ? 'bg-red-600 text-white animate-pulse scale-110 shadow-red-300' 
                        : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-green-300'
                    }`}
                    title={isRecording ? 'Click to stop voice recording' : 'Click to start voice recording (max 10 seconds)'}
                  >
                    <span className="text-xl">
                      {isRecording ? '🛑' : '🎤'}
                    </span>
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message, use voice recording (🎤), or upload documents (📄)..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-300"
                  >
                    Send
                  </button>
                </div>

                {/* Enhanced Features Info */}
                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>🎤 Voice: Click microphone to record (10s max)</span>
                    <span>🔈 Audio: Click speaker icons to listen</span>
                    <span>📄 Upload: Drag files or use Document Center</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Voice AI Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeSection === 'services' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">🌍 Global Expert Team & Services</h2>
              <p className="text-xl text-slate-600 mb-4">Professional business solutions across three continents</p>
              <div className="flex justify-center space-x-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">🇭🇺 Hungary Office</span>
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">🇬🇧 London Office</span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">🇦🇪 Dubai Office</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Visa & License Services */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🛂</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Visa & License Services</h3>
                    <p className="text-slate-600 mb-2">Expert: **Rahul**</p>
                    <p className="text-sm text-slate-500 mb-3">📧 rahul@skvbusiness.com</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">Starting from $199</span>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <h4 className="font-semibold text-slate-900 mb-3">Global Processing Network:</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-50 text-blue-700 p-2 rounded">
                          <div className="font-bold">🇭🇺 Hungary</div>
                          <div>EU Visas</div>
                        </div>
                        <div className="bg-red-50 text-red-700 p-2 rounded">
                          <div className="font-bold">🇬🇧 London</div>
                          <div>UK Visas</div>
                        </div>
                        <div className="bg-green-50 text-green-700 p-2 rounded">
                          <div className="font-bold">🇦🇪 Dubai</div>
                          <div>Asia/ME Visas</div>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Tourist & Business Visas (150+ countries)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Student Visas & Work Permits</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Business License Applications</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>License Renewals & Compliance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => window.open('mailto:rahul@skvbusiness.com?subject=Visa & License Services - Global Inquiry&body=Hello Rahul,%0A%0AI am interested in your visa and license services through your global office network.%0A%0APlease contact me to discuss:%0A- Service requirements%0A- Processing timeline%0A- Required documents%0A- Pricing details%0A%0ABest regards')}
                  >
                    📧 Contact Rahul (Visa Expert)
                  </button>
                </div>
              </div>

              {/* Tax Services */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Tax Services</h3>
                    <p className="text-slate-600 mb-2">Expert: **Mohit**</p>
                    <p className="text-sm text-slate-500 mb-3">📧 mohit@skvbusiness.com</p>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Starting from $99</span>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <h4 className="font-semibold text-slate-900 mb-3">Tax Jurisdiction Coverage:</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-50 text-blue-700 p-2 rounded">
                          <div className="font-bold">🇭🇺 Hungary</div>
                          <div>EU Tax Laws</div>
                        </div>
                        <div className="bg-red-50 text-red-700 p-2 rounded">
                          <div className="font-bold">🇬🇧 London</div>
                          <div>UK Tax System</div>
                        </div>
                        <div className="bg-green-50 text-green-700 p-2 rounded">
                          <div className="font-bold">🇦🇪 Dubai</div>
                          <div>UAE Tax Laws</div>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Tax Filing & GST Registration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>International Tax Compliance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Cross-border Tax Optimization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500 text-lg">•</span>
                        <span>Financial Planning & Advisory</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => window.open('mailto:mohit@skvbusiness.com?subject=Global Tax Services Inquiry&body=Hello Mohit,%0A%0AI need assistance with tax services across your global office network.%0A%0APlease provide information about:%0A- Tax filing requirements%0A- International compliance%0A- Pricing structure%0A- Timeline for services%0A%0ABest regards')}
                  >
                    📧 Contact Mohit (Tax Expert)
                  </button>
                </div>
              </div>

              {/* European & London Setup */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🇬🇧</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">European & London Setup</h3>
                    <p className="text-slate-600 mb-2">Expert: **Nikita**</p>
                    <p className="text-sm text-slate-500 mb-3">📧 nikita@skvbusiness.com</p>
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">Starting from £299</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>UK Company Formation & Banking</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>EU Business Registration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>London Office Establishment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>European Compliance & VAT</span>
                    </li>
                  </ul>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => window.open('mailto:nikita@skvbusiness.com?subject=European Business Setup Inquiry&body=Hello Nikita,%0A%0AI am interested in European and London business setup services.%0A%0APlease provide details about:%0A- Company formation process%0A- Required documentation%0A- Timeline and costs%0A- Banking setup assistance%0A%0ABest regards')}
                  >
                    📧 Contact Nikita (Europe Expert)
                  </button>
                </div>
              </div>

              {/* Legal & Advisory */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">⚖️</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Legal & Advisory</h3>
                    <p className="text-slate-600 mb-2">Expert: **Sunil (CEO)**</p>
                    <p className="text-sm text-slate-500 mb-3">📧 sunil@skvbusiness.com</p>
                    <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Starting from $149</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>Legal Consultation & Strategy</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>Contract Review & Drafting</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>Business Advisory & Planning</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>International Compliance</span>
                    </li>
                  </ul>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => window.open('mailto:sunil@skvbusiness.com?subject=Legal & Advisory Services Inquiry&body=Hello Sunil,%0A%0AI need legal and advisory services for my business operations.%0A%0APlease contact me to discuss:%0A- Legal consultation requirements%0A- Business advisory needs%0A- Timeline and pricing%0A- Strategic planning assistance%0A%0ABest regards')}
                  >
                    📧 Contact Sunil (CEO & Legal Expert)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT CENTER TAB */}
        {activeSection === 'documents' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">🌍 Global Document Management Center</h2>
              <p className="text-xl text-slate-600 mb-4">Upload and access documents from Hungary, London, Dubai, or anywhere worldwide</p>
              <div className="flex justify-center space-x-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">🇭🇺 Hungary Access</span>
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">🇬🇧 London Access</span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">🇦🇪 Dubai Access</span>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center space-x-3">
                  <span>📤</span>
                  <span>Secure Document Upload</span>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">Global Cloud Storage</span>
                </h3>
                
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 transition-all bg-gradient-to-br from-slate-50 to-blue-50 hover:from-blue-50 hover:to-purple-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    handleFileUpload(files);
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.txt,.xlsx,.ppt"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="document-upload-main"
                  />
                  
                  <div className="space-y-6">
                    <div className="text-8xl">📁</div>
                    <div>
                      <h4 className="text-2xl font-semibold text-slate-900 mb-3">
                        Drop documents here or click to browse
                      </h4>
                      <p className="text-lg text-slate-600 mb-4">
                        Upload from airport, office, home, or anywhere worldwide
                      </p>
                      <p className="text-sm text-slate-500 mb-6">
                        Secure cloud storage accessible from all our global offices
                      </p>
                    </div>
                    
                    <button
                      onClick={() => document.getElementById('document-upload-main')?.click()}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                    >
                      📄 Choose Documents to Upload
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 mt-6">
                      <div>
                        <p className="font-medium mb-2">Supported Formats:</p>
                        <p>PDF, JPG, PNG, DOCX, DOC, TXT, XLSX, PPT</p>
                      </div>
                      <div>
                        <p className="font-medium mb-2">File Specifications:</p>
                        <p>Max size: 50MB per file | Unlimited total uploads</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg text-purple-700 font-semibold">📤 Uploading to SKV Global Cloud...</span>
                      <div className="flex-1 bg-purple-200 rounded-full h-4">
                        <div 
                          className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-lg text-purple-700 font-bold">{uploadProgress}%</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-2">Uploading to secure servers in Hungary, London, and Dubai...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Documents Display */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center space-x-3">
                    <span>📄</span>
                    <span>Your Documents ({uploadedFiles.length})</span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Cloud Stored</span>
                  </h3>
                  
                  <div className="grid gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">
                            {file.type === 'PDF' ? '📄' : file.type === 'JPG' || file.type === 'PNG' ? '🖼️' : '📝'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{file.name}</p>
                            <div className="flex items-center space-x-6 text-sm text-slate-600">
                              <span>📏 Size: {file.size}</span>
                              <span>📂 Category: {file.category}</span>
                              <span>🕒 Uploaded: {file.uploadDate.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full font-medium">
                            ✅ Uploaded to Global Cloud
                          </span>
                          <button 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            onClick={() => alert(`Downloading ${file.name} from SKV Global Cloud... (Demo version)`)}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Global Access Information */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl border border-blue-200 shadow-lg">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">🌍 Global Document Access Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                    <div className="text-4xl mb-3">🇭🇺</div>
                    <h4 className="font-semibold text-slate-900 mb-2">Hungary Office</h4>
                    <p className="text-sm text-slate-600 mb-3">European Operations Hub</p>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>✅ Upload & download documents</p>
                      <p>✅ EU visa processing</p>
                      <p>✅ European compliance</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                    <div className="text-4xl mb-3">🇬🇧</div>
                    <h4 className="font-semibold text-slate-900 mb-2">London Office</h4>
                    <p className="text-sm text-slate-600 mb-3">UK & Commonwealth Hub</p>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>✅ Upload & download documents</p>
                      <p>✅ UK business setup</p>
                      <p>✅ Commonwealth services</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
                    <div className="text-4xl mb-3">🇦🇪</div>
                    <h4 className="font-semibold text-slate-900 mb-2">Dubai Office</h4>
                    <p className="text-sm text-slate-600 mb-3">Middle East & Asia Hub</p>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>✅ Upload & download documents</p>
                      <p>✅ UAE business setup</p>
                      <p>✅ Middle East expansion</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    <strong>Global Cloud Storage:</strong> Your documents are automatically synchronized across all three office locations 
                    for maximum security and accessibility worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER WITH DUBAI OFFICE */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-6">SKV Global Business Service LLC</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Advanced AI-powered business platform with voice messaging, global document management, 
                and expert team routing across three continents.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-600">
                  🇭🇺 Hungary Office
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-600">
                  🇬🇧 London Office
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-600">
                  🇦🇪 Dubai Office
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Expert Team Contacts</h4>
              <div className="space-y-3 text-sm text-slate-300">
                <p className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>General Inquiries: info@skvbusiness.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🛂</span>
                  <span>Visa & Licenses: rahul@skvbusiness.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>Tax Services: mohit@skvbusiness.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🇬🇧</span>
                  <span>European Setup: nikita@skvbusiness.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>⚖️</span>
                  <span>Legal & Advisory: sunil@skvbusiness.com</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Platform Features</h4>
              <div className="space-y-3 text-sm text-slate-300">
                <p className="flex items-center space-x-2">
                  <span>🎤</span>
                  <span>Voice messaging & recording</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🔈</span>
                  <span>Audio response playback</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📄</span>
                  <span>Global document upload</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>☁️</span>
                  <span>Secure cloud storage</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Multi-office access</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>Mobile optimized</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 SKV Global Business Service LLC. All rights reserved. | 
              Voice-Enabled AI Platform with Global Document Management | 
              🇭🇺 Hungary • 🇬🇧 London • 🇦🇪 Dubai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}