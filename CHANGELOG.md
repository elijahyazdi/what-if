# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-10

### Added
- Initial release of "What Could You Do?" app
- Age-appropriate prompts for 4 age groups (3-5, 6-8, 9-12, 13-15+ years)
- Welcome screen for first-time users
- Home screen with age group selection
- Interactive prompt display with navigation
- Favorites system for saving prompts
- Settings screen with customization options:
  - Dark mode toggle
  - Notification preferences
  - Text-to-speech option
  - Content filtering (vetted/community/all)
- Developer tools screen for testing
- Custom Barrio font integration
- Persistent storage using AsyncStorage
- Cross-platform support (iOS, Android, Web)
- Responsive design for different screen sizes
- Accessibility features

### Technical Stack
- React Native with Expo ~50.0.0
- TypeScript 5.1.3
- React 18.2.0
- AsyncStorage for data persistence
- Expo Font for custom typography
- Expo Vector Icons (Feather)
- Webpack support for web deployment

---

## Future Roadmap

### Planned Features
- [ ] User-submitted prompt suggestions
- [ ] Multi-language support
- [ ] Audio playback for prompts
- [ ] Parent/teacher dashboard
- [ ] Progress tracking and insights
- [ ] Sharing prompts with others
- [ ] Custom prompt creation
- [ ] Theme customization
- [ ] Offline mode improvements

### Under Consideration
- Cloud sync for favorites
- Social features (limited, age-appropriate)
- Premium content packs
- Educational resources for parents
- Integration with learning platforms
