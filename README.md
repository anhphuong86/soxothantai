# SolarCalc Pro - Professional Solar Energy Calculator

## Overview
SolarCalc Pro is a scientifically accurate photovoltaic system design tool built on the PVWatts model developed by NREL (National Renewable Energy Laboratory). It provides real-time calculations using NASA POWER meteorological data with 22+ years of historical records.

## Features

### Core Capabilities
- **Real-time meteorological data** from NASA POWER API
- **PVWatts model implementation** with scientific accuracy
- **Monthly energy production charts** with detailed analysis
- **Location-based calculations** using GPS coordinates
- **System optimization** with tilt and azimuth angle analysis
- **CO₂ offset calculations** for environmental impact assessment

### Technical Specifications
- **Solar Position Calculations**: Solar elevation and incident angle modeling
- **Temperature Coefficient Effects**: Panel performance degradation based on temperature
- **Soiling and System Losses**: Real-world performance data integration
- **Shading Analysis**: Inverter efficiency curves and system losses
- **Ground Albedo**: Reflected irradiance component modeling

### Data Sources
- **NASA POWER**: 22+ years of meteorological data
- **NREL PVWatts**: Scientifically validated algorithms
- **OpenStreetMap**: Location geocoding and reverse geocoding
- **Real-time GPS**: Current location detection

## Installation

### Requirements
- Modern web browser with JavaScript support
- Internet connection for meteorological data
- GPS access for location services (optional)

### Setup
1. Clone or download the project
2. Open `index.html` in any modern web browser
3. No server setup required - runs client-side

## Usage

### Basic Operation
1. **Location Input**: Enter city name or use GPS coordinates
2. **System Parameters**: Configure system size, panel efficiency, tilt angle
3. **Calculate**: Click "Calculate Solar Potential" button
4. **Results**: View annual energy production and monthly charts

### Advanced Configuration
- **Panel Efficiency**: 10-25% efficiency range
- **Tilt Angle**: 0-90 degrees for optimal positioning
- **Azimuth Angle**: -180 to 180 degrees for orientation
- **System Losses**: 0-30% for real-world performance
- **Ground Albedo**: 0-1 for reflected irradiance

## Scientific Accuracy

### Model Validation
- **PVWatts Model**: NREL validated algorithms
- **NASA Data**: 22+ years of meteorological records
- **Temperature Effects**: Panel performance degradation curves
- **Solar Position**: Astronomical solar position calculations
- **Incident Angle**: Geometric solar incidence modeling

### Calculation Methods
1. **Solar Position**: Astronomical solar position calculations
2. **Incident Angle**: Geometric solar incidence modeling
3. **Temperature Correction**: Panel performance degradation curves
4. **System Losses**: Real-world performance data integration
5. **CO₂ Offset**: Environmental impact calculations

## API Integration

### NASA POWER API
```javascript
const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_KT,ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&format=JSON&start=2020&end=2022`;
```

### OpenStreetMap API
```javascript
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
```

### Geocoding API
```javascript
const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
```

## Performance Metrics

### Energy Production
- **Annual Energy**: Total yearly energy production (kWh/year)
- **Specific Yield**: Energy per kW capacity (kWh/kWp/year)
- **Peak Sun Hours**: Average daily solar hours (hours/day)
- **CO₂ Offset**: Environmental impact (kg/year)

### Monthly Analysis
- **Global Horizontal Irradiance**: Total solar irradiance (kWh/m²/day)
- **Direct Normal Irradiance**: Direct solar component (kWh/m²/day)
- **Diffuse Horizontal Irradiance**: Diffuse solar component (kWh/m²/day)
- **Energy Production**: Monthly energy output (kWh)

## Environmental Impact

### CO₂ Offset Calculations
- **Grid Average**: 0.5 kg CO2 per kWh
- **Solar Offset**: Complete renewable energy replacement
- **Environmental Impact**: Quantified carbon footprint reduction

## Technical Architecture

### Frontend Components
- **HTML5**: Semantic markup with accessibility
- **CSS3**: Responsive design with modern styling
- **JavaScript**: ES6+ with async/await patterns
- **Chart.js**: Interactive charts and visualization

### Backend Integration
- **NASA POWER API**: Meteorological data integration
- **OpenStreetMap**: Location geocoding services
- **GPS Services**: Real-time location detection
- **Browser APIs**: Geolocation and mapping services

## Browser Compatibility
- **Chrome**: 90+ version with full features
- **Firefox**: 90+ version with full features
- **Safari**: 14+ version with full features
- **Edge**: 90+ version with full features

## Mobile Support
- **Responsive Design**: Mobile-first architecture
- **Touch Controls**: Mobile-optimized input controls
- **GPS Integration**: Mobile location services
- **Progressive Web App**: PWA capabilities ready

## Security
- **HTTPS Required**: API security requirements
- **CORS Enabled**: Cross-origin resource sharing
- **Rate Limiting**: API usage optimization
- **Error Handling**: Graceful failure modes

## Support
- **Documentation**: Comprehensive technical documentation
- **API Integration**: Real-time meteorological data
- **Scientific Accuracy**: NREL validated algorithms
- **Professional Grade**: Engineering-grade calculations

## License
MIT License - Open source solar energy calculator with professional-grade accuracy
