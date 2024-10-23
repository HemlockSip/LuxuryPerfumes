# Salesforce Privacy Management System

## Overview
This project implements a comprehensive privacy management system in Salesforce, designed to handle customer consent and privacy requests in compliance with GDPR requirements. It includes both technical documentation and Lightning Web Components for efficient case management.

## Features

### 1. Privacy Management Process
- Multi-channel consent management
  - Direct email requests
  - Marketing communications footer
  - Shopify account preferences
- Automated case handling and routing
- GDPR compliance monitoring
- Integrated reporting system

### 2. Case Status LWC Component
Custom Lightning Web Component displaying critical case information in three visual blocks:
- Days Open Counter
- Case Status
- Escalation Status

![Component Preview](component-preview.png) <!-- Note: Add actual screenshot -->

## Technical Documentation

### Privacy Management Documentation
Complete technical and functional documentation including:
- Process workflows
- Role definitions
- System configurations
- Integration points
- Security measures

[View Full Documentation](./docs/privacy-management.md)

## Components

### Case Status Blocks Component
```javascript
// Main structure
├── caseStatusBlocks/
│   ├── caseStatusBlocks.html
│   ├── caseStatusBlocks.js
│   ├── caseStatusBlocks.css
│   └── caseStatusBlocks.js-meta.xml
```

#### Key Features
1. **Days Open Block**
   - Dynamic calculation of case age
   - Color-coded status indicators:
     - Green: ≤ 2 days
     - Yellow: 3-5 days
     - Red: > 5 days

2. **Case Status Block**
   - Visual status representation
   - Status-specific icons
   - Color-coded backgrounds:
     - Blue: New
     - Yellow: Working
     - Green: Closed

3. **Escalation Block**
   - Real-time escalation status
   - Visual indicators
   - Status-specific icons

#### Implementation Details

##### JavaScript Controller
```javascript
// Key methods
- processData(): Calculates days open and processes case status
- get daysOpenClass(): Returns dynamic styling based on days open
- get statusClass(): Returns styling based on case status
- get escalatedClass(): Returns styling based on escalation status
```

##### Component Configuration
```xml
<targetConfig targets="lightning__RecordPage">
    <objects>
        <object>Case</object>
    </objects>
</targetConfig>
```

##### Styling
The component uses both SLDS classes and custom CSS:
- SLDS Theme Classes:
  - `slds-theme_success`
  - `slds-theme_warning`
  - `slds-theme_error`
  - `slds-theme_info`

## Installation

1. **Deploy Components**
```bash
sfdx force:source:deploy -p force-app/main/default/lwc/caseStatusBlocks
```

2. **Add to Lightning Page**
- Open Lightning App Builder
- Edit Case Record Page
- Drag "Case Status Blocks" component to desired location
- Save and Activate

## Configuration

### Component Color Scheme
Colors are defined using SLDS theme classes:
```javascript
get daysOpenClass() {
    let baseClass = 'status-block days-open ';
    if (this.daysOpen <= 2) return baseClass + 'slds-theme_success';
    if (this.daysOpen <= 5) return baseClass + 'slds-theme_warning';
    return baseClass + 'slds-theme_error';
}
```

To customize colors, modify the CSS classes in `caseStatusBlocks.css`.

## Future Enhancements
- [ ] Configurable color schemes through design attributes
- [ ] Additional case metrics display
- [ ] Custom threshold settings
- [ ] Enhanced mobile responsiveness
- [ ] Integration with other case management features

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[MIT License](LICENSE.md)

## Contact
For questions and support, please open an issue in the repository.

---
*Note: This project was created as part of a technical interview assignment demonstrating Salesforce development capabilities.*
