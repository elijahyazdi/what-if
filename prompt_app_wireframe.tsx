import React, { useState } from 'react';
import { Volume2, ChevronRight, Plus, Home, User, Settings, Bell, Lock, HelpCircle, Mail, FileText, LogOut, Trash2, Moon, Globe, Users, Heart, Share2, MessageCircle, Star, Shield } from 'lucide-react';

const WireframeApp = () => {
  const [screen, setScreen] = useState('welcome');
  const [selectedAge, setSelectedAge] = useState(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [contentFilter, setContentFilter] = useState('vetted');

  // Dynamically load Barrio, Work Sans, and Road Rage fonts from Google Fonts
  React.useEffect(() => {
    const barrioLink = document.createElement('link');
    barrioLink.href = 'https://fonts.googleapis.com/css2?family=Barrio&display=swap';
    barrioLink.rel = 'stylesheet';
    document.head.appendChild(barrioLink);
    
    const workSansLink = document.createElement('link');
    workSansLink.href = 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap';
    workSansLink.rel = 'stylesheet';
    document.head.appendChild(workSansLink);
    
    const roadRageLink = document.createElement('link');
    roadRageLink.href = 'https://fonts.googleapis.com/css2?family=Road+Rage&display=swap';
    roadRageLink.rel = 'stylesheet';
    document.head.appendChild(roadRageLink);
    
    return () => {
      document.head.removeChild(barrioLink);
      document.head.removeChild(workSansLink);
      document.head.removeChild(roadRageLink);
    };
  }, []);

  const ageGroups = [
    { id: '3-5', label: '3-5 years', bgColor: '#90dcff' },
    { id: '6-8', label: '6-8 years', bgColor: '#00db96' },
    { id: '9-12', label: '9-12 years', bgColor: '#e10086' },
    { id: '13-15', label: '13-15+ years', bgColor: '#fdfb76' }
  ];

  const prompts = {
    '3-5': [
      "What if you really want a toy that another kid is playing with? What could you do?",
      "What if you accidentally spill your juice on the floor? What could you do?",
      "What if you feel scared at bedtime? What could you do?"
    ],
    '6-8': [
      "What if you see someone being mean to the new student? What could you do?",
      "What if you break something that belongs to a friend? What could you do?",
      "What if you're feeling left out at recess? What could you do?"
    ],
    '9-12': [
      "What if your friend asks you to lie to their parents? What could you do?",
      "What if you see someone cheating on a test? What could you do?",
      "What if you're struggling with homework but afraid to ask for help? What could you do?"
    ],
    '13-15': [
      "What if your friends pressure you to do something you're uncomfortable with? What could you do?",
      "What if you discover a friend is being bullied online? What could you do?",
      "What if you disagree strongly with something your parents decided? What could you do?"
    ]
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <span className="absolute text-indigo-200 opacity-20 pointer-events-none" style={{ fontFamily: 'Barrio, cursive', fontSize: '40rem', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>?</span>
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <h1 className="text-9xl font-bold text-gray-900 mb-3 text-center uppercase" style={{ fontFamily: 'Barrio, cursive' }}>What Could You Do?</h1>
        <p className="text-xl text-gray-600 text-center mb-8 max-w-sm">
          Foster meaningful conversations with children through age-appropriate prompts that spark critical thinking and ethical reasoning
        </p>
        <button 
          onClick={() => setScreen('howToUse')}
          className="w-full max-w-sm text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-xl"
          style={{ backgroundColor: '#e10086' }}
        >
          Get Started
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="pb-8 px-6 text-center relative z-10">
        <p className="text-base text-gray-500">For Parents, Educators & Therapists</p>
      </div>
    </div>
  );

  const HowToUseScreen = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <button onClick={() => setScreen('welcome')} style={{ color: '#e10086' }} className="mb-4">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>How to Use This App</h2>
        <p className="text-gray-600 mt-1 text-lg">A guide to meaningful conversations</p>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        <div className="bg-indigo-50 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose an Age Group</h3>
              <p className="text-gray-700 text-sm">
                Select the age range that best matches the child you're talking with. Prompts are designed to be developmentally appropriate.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Read the Prompt Together</h3>
              <p className="text-gray-700 text-sm">
                Share the "What if..." scenario with the child. Use the audio button if helpful. Take your time—there's no rush.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Listen and Explore Together</h3>
              <p className="text-gray-700 text-sm">
                Ask open-ended questions. There are no right or wrong answers. Focus on their thinking process, not finding the "correct" solution.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Discuss Multiple Possibilities</h3>
              <p className="text-gray-700 text-sm">
                Encourage thinking about different options. What might happen with each choice? How might others feel? What values matter here?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-white mb-20">
        <button 
          onClick={() => setScreen('home')}
          className="w-full text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-xl"
          style={{ backgroundColor: '#e10086' }}
        >
          Let's Get Started
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Home</h2>
        <p className="text-gray-600 mt-1 text-lg">Start a meaningful conversation</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-6">
          <div className="bg-white p-6 rounded-2xl border-2" style={{ borderColor: '#49297e' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Ready to explore?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Choose an age group to begin your conversation journey
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    setSelectedAge(group.id);
                    setCurrentPromptIndex(0);
                    setScreen('prompt');
                  }}
                  className="p-4 rounded-xl text-left transition-all hover:scale-105 border-2"
                  style={{ backgroundColor: group.bgColor, borderColor: '#49297e' }}
                >
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{group.label}</h4>
                  <p className="text-base text-gray-600">{prompts[group.id].length} prompts</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedAge && (
          <div className="px-6 pb-4">
            <div className="bg-white border-2 p-6 rounded-2xl" style={{ borderColor: '#49297e' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Continue where you left off</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Ages {ageGroups.find(g => g.id === selectedAge)?.label} • Prompt {currentPromptIndex + 1} of {prompts[selectedAge].length}
              </p>
              <button 
                onClick={() => setScreen('prompt')}
                className="w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-xl"
                style={{ backgroundColor: '#e10086' }}
              >
                Resume
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="px-6 pb-4">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span style={{ color: '#e10086' }} className="font-bold">•</span>
                <span>There are no right or wrong answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Focus on the thinking process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Listen without judgment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Share your thoughts too</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const PromptScreen = () => {
    const currentPrompt = prompts[selectedAge][currentPromptIndex];
    const totalPrompts = prompts[selectedAge].length;
    const ageLabel = ageGroups.find(g => g.id === selectedAge)?.label;
    const promptId = `${selectedAge}-${currentPromptIndex}`;
    const isFavorited = favorites.includes(promptId);

    const toggleFavorite = () => {
      if (isFavorited) {
        setFavorites(favorites.filter(id => id !== promptId));
      } else {
        setFavorites([...favorites, promptId]);
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <button onClick={() => setScreen('home')} style={{ color: '#e10086' }} className="mb-4">
            ← Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ages {ageLabel}</h2>
              <p className="text-sm text-gray-500">Prompt {currentPromptIndex + 1} of {totalPrompts}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${isFavorited ? 'text-yellow-600' : 'text-gray-600'}`}
                style={{ backgroundColor: isFavorited ? '#fdfb76' : '#f3f4f6' }}
              >
                <Star size={24} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 rounded-full text-white" style={{ backgroundColor: '#49297e' }}>
                <Volume2 size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md">
            <div className="p-8 rounded-2xl shadow-sm" style={{ background: 'linear-gradient(to bottom right, #90dcff, #fdfb76)' }}>
              <p className="text-3xl text-gray-900 leading-relaxed font-medium">
                {currentPrompt}
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Discussion Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Listen without judgment</li>
                <li>• Ask follow-up questions</li>
                <li>• Explore multiple solutions</li>
                <li>• Share your own thoughts too</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3 pb-24">
          <button 
            onClick={() => {
              const next = (currentPromptIndex + 1) % totalPrompts;
              setCurrentPromptIndex(next);
            }}
            className="w-full text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-xl"
            style={{ backgroundColor: '#e10086' }}
          >
            Next Prompt
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const CommunityScreen = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Community</h2>
        <p className="text-gray-600 mt-1 text-lg">Share and discover prompts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-6">
          <div className="p-6 rounded-2xl border-2" style={{ background: 'linear-gradient(to bottom right, #90dcff, #fdfb76)', borderColor: '#49297e' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Share Your Ideas</h3>
            <p className="text-sm text-gray-700 mb-4">
              Share prompts you've created or favorites you've discovered. Help other parents, educators, and therapists spark meaningful conversations.
            </p>
            <button 
              className="w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-xl"
              style={{ backgroundColor: '#e10086' }}
            >
              <Plus size={20} />
              Create New Prompt
            </button>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            <button className="px-4 py-2 text-white rounded-full font-medium text-sm whitespace-nowrap" style={{ backgroundColor: '#e10086' }}>
              All Prompts
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap">
              My Favorites
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap">
              My Submissions
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap">
              Trending
            </button>
          </div>
        </div>

        <div className="px-6 space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#90dcff' }}>
                  <User size={20} style={{ color: '#49297e' }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sarah M.</p>
                  <p className="text-xs text-gray-500">Parent • 2 days ago</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-gray-900" style={{ backgroundColor: '#00db96' }}>
                Ages 6-8
              </span>
            </div>
            
            <p className="text-gray-900 mb-4 leading-relaxed">
              What if you found a lost wallet with money in it? What could you do?
            </p>
            
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 text-gray-600" style={{ hover: { color: '#e10086' } }}>
                <Heart size={18} />
                <span className="text-sm font-medium">24</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600" style={{ hover: { color: '#e10086' } }}>
                <MessageCircle size={18} />
                <span className="text-sm font-medium">8</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600" style={{ hover: { color: '#e10086' } }}>
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e10086' }}>
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Michael T.</p>
                  <p className="text-xs text-gray-500">Educator • 5 days ago</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: '#e10086' }}>
                Ages 9-12
              </span>
            </div>
            
            <p className="text-gray-900 mb-4 leading-relaxed">
              What if you noticed a classmate was always alone at lunch? What could you do?
            </p>
            
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 hover:text-pink-600" style={{ color: '#e10086' }}>
                <Heart size={18} fill="currentColor" />
                <span className="text-sm font-medium">42</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-pink-600" style={{ '--tw-hover-color': '#e10086' }}>
                <MessageCircle size={18} />
                <span className="text-sm font-medium">15</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-pink-600">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fdfb76' }}>
                  <User size={20} style={{ color: '#49297e' }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">You</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-gray-900" style={{ backgroundColor: '#90dcff' }}>
                Ages 3-5
              </span>
            </div>
            
            <p className="text-gray-900 mb-4 leading-relaxed">
              What if your toy broke and you feel sad? What could you do?
            </p>
            
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <Heart size={18} />
                <span className="text-sm font-medium">18</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">5</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00db96' }}>
                  <User size={20} style={{ color: '#49297e' }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Dr. Lisa K.</p>
                  <p className="text-xs text-gray-500">Therapist • 1 week ago</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-gray-900" style={{ backgroundColor: '#fdfb76' }}>
                Ages 13-15+
              </span>
            </div>
            
            <p className="text-gray-900 mb-4 leading-relaxed">
              What if you're feeling overwhelmed with schoolwork and activities? What could you do?
            </p>
            
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <Heart size={18} />
                <span className="text-sm font-medium">31</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">12</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Profile</h2>
        <p className="text-gray-600 mt-1 text-lg">Your conversation journey</p>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #90dcff, #fdfb76)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#49297e' }}>
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Welcome back!</h3>
              <p className="text-sm text-gray-600">Parent & Educator</p>
            </div>
          </div>
          <button className="w-full bg-white py-2 rounded-lg font-semibold text-sm" style={{ color: '#e10086' }}>
            Edit Profile
          </button>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#90dcff' }}>
              <p className="text-2xl font-bold" style={{ color: '#49297e' }}>24</p>
              <p className="text-sm text-gray-600 mt-1">Prompts Explored</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#00db96' }}>
              <p className="text-2xl font-bold" style={{ color: '#49297e' }}>8</p>
              <p className="text-sm text-gray-600 mt-1">Days Active</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#e10086' }}>
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-sm text-white mt-1">Age Groups Used</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#fdfb76' }}>
              <p className="text-2xl font-bold" style={{ color: '#49297e' }}>2</p>
              <p className="text-sm text-gray-600 mt-1">Prompts Submitted</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#e10086' }}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ages 6-8</p>
                <p className="text-xs text-gray-600 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#00db96' }}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ages 9-12</p>
                <p className="text-xs text-gray-600 mt-1">5 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#49297e' }}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ages 3-5</p>
                <p className="text-xs text-gray-600 mt-1">1 week ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">First Conversation</p>
                <p className="text-xs text-gray-600">Started your journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Consistent Explorer</p>
                <p className="text-xs text-gray-600">7 days of conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Master Guide</p>
                <p className="text-xs text-gray-600">Complete 50 prompts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Favorite Prompts</h3>
            <Star size={20} className="text-yellow-600" fill="currentColor" style={{ color: '#fdfb76', stroke: '#49297e' }} />
          </div>
          {favorites.length === 0 ? (
            <div className="text-center py-6">
              <Star size={40} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No favorites yet</p>
              <p className="text-xs text-gray-500 mt-1">Tap the star icon on prompts to save them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favId) => {
                const [ageId, promptIdx] = favId.split('-');
                const prompt = prompts[ageId][parseInt(promptIdx)];
                const ageGroup = ageGroups.find(g => g.id === ageId);
                return (
                  <div key={favId} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: ageGroup.bgColor }}>
                        {ageGroup.label}
                      </span>
                      <button 
                        onClick={() => setFavorites(favorites.filter(id => id !== favId))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-900">{prompt}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border-2 rounded-2xl p-6" style={{ borderColor: '#49297e' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} style={{ color: '#49297e' }} />
            <h3 className="text-lg font-semibold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Quality & Safety</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Control what user-created content appears in your feed
          </p>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="contentFilter"
                value="all"
                checked={contentFilter === 'all'}
                onChange={(e) => setContentFilter(e.target.value)}
                className="mt-1 w-4 h-4 cursor-pointer"
                style={{ accentColor: '#e10086' }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Display All User Created Content</p>
                <p className="text-xs text-gray-500 mt-1">Show all community prompts without filtering</p>
              </div>
            </label>
            
            <div className="border-t border-gray-200"></div>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="contentFilter"
                value="vetted"
                checked={contentFilter === 'vetted'}
                onChange={(e) => setContentFilter(e.target.value)}
                className="mt-1 w-4 h-4 cursor-pointer"
                style={{ accentColor: '#e10086' }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900">Display User Created Content After Vetting</p>
                  <span className="px-2 py-0.5 text-white text-xs font-semibold rounded" style={{ backgroundColor: '#49297e' }}>Recommended</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Only show prompts reviewed by our moderation team</p>
              </div>
            </label>
            
            <div className="border-t border-gray-200"></div>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="contentFilter"
                value="friends"
                checked={contentFilter === 'friends'}
                onChange={(e) => setContentFilter(e.target.value)}
                className="mt-1 w-4 h-4 cursor-pointer"
                style={{ accentColor: '#e10086' }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Display Only User Created Content from Friends</p>
                <p className="text-xs text-gray-500 mt-1">Most restrictive - only see prompts from your connections</p>
              </div>
            </label>
          </div>
        </div>

        <div className="p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(to right, #49297e, #e10086)' }}>
          <h3 className="text-lg font-semibold mb-2 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Upgrade to Professional</h3>
          <p className="text-sm mb-4" style={{ color: '#fdfb76' }}>
            Access case management, analytics, and specialized prompt libraries
          </p>
          <button className="w-full bg-white py-3 rounded-xl font-semibold" style={{ color: '#e10086' }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Settings</h2>
        <p className="text-gray-600 mt-1 text-lg">Customize your experience</p>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h3>
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Edit Profile</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Email Preferences</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Privacy & Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Preferences</h3>
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e10086]"></div>
              </label>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Text-to-Speech</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">Language</p>
                  <p className="text-xs text-gray-500">English</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Content</h3>
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Plus size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Submit a Prompt</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">My Submissions</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Support & Info</h3>
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Help & FAQ</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Contact Support</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">About</p>
                  <p className="text-xs text-gray-500">Version 1.0.0</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(to right, #49297e, #e10086)' }}>
          <h3 className="text-lg font-semibold mb-2 uppercase" style={{ fontFamily: 'Barrio, cursive' }}>Go Professional</h3>
          <p className="text-sm mb-4" style={{ color: '#fdfb76' }}>
            Unlock advanced features for educators and therapists
          </p>
          <button className="w-full bg-white py-3 rounded-xl font-semibold" style={{ color: '#e10086' }}>
            Upgrade Now
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">Log Out</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-600" />
                <span className="text-red-600 font-medium">Delete Account</span>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3 flex justify-around">
      <button 
        onClick={() => setScreen('home')}
        className={`flex flex-col items-center gap-1`}
        style={{ color: screen === 'home' ? '#e10086' : '#9ca3af' }}
      >
        <Home size={24} />
        <span className="text-sm">Home</span>
      </button>
      <button 
        onClick={() => setScreen('community')}
        className={`flex flex-col items-center gap-1`}
        style={{ color: screen === 'community' ? '#e10086' : '#9ca3af' }}
      >
        <Users size={24} />
        <span className="text-sm">Community</span>
      </button>
      <button 
        onClick={() => setScreen('profile')}
        className={`flex flex-col items-center gap-1`}
        style={{ color: screen === 'profile' ? '#e10086' : '#9ca3af' }}
      >
        <User size={24} />
        <span className="text-sm">Profile</span>
      </button>
      <button 
        onClick={() => setScreen('settings')}
        className={`flex flex-col items-center gap-1`}
        style={{ color: screen === 'settings' ? '#e10086' : '#9ca3af' }}
      >
        <Settings size={24} />
        <span className="text-sm">Settings</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl h-screen flex flex-col text-lg" style={{ fontFamily: 'Road Rage, cursive' }}>
      <div className="flex-1 overflow-hidden">
        {screen === 'welcome' && <WelcomeScreen />}
        {screen === 'howToUse' && <HowToUseScreen />}
        {screen === 'home' && <HomeScreen />}
        {screen === 'community' && <CommunityScreen />}
        {screen === 'profile' && <ProfileScreen />}
        {screen === 'settings' && <SettingsScreen />}
        {screen === 'prompt' && <PromptScreen />}
      </div>
      {(screen === 'home' || screen === 'community' || screen === 'profile' || screen === 'settings' || screen === 'prompt') && <BottomNav />}
    </div>
  );
};

export default WireframeApp;