/**
 * Solar Energy Calculator - Professional PV System Design Tool
 * Based on PVWatts model and NASA POWER meteorological data
 * 
 * @author SolarCalc Pro Team
 * @version 1.0.0
 */

class SolarCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.chart = null;
    }

    initializeElements() {
        // Input elements
        this.locationInput = document.getElementById('location');
        this.latitudeInput = document.getElementById('latitude');
        this.longitudeInput = document.getElementById('longitude');
        this.systemSizeInput = document.getElementById('systemSize');
        this.systemSizeRange = document.getElementById('systemSizeRange');
        this.panelEfficiencyInput = document.getElementById('panelEfficiency');
        this.tiltAngleInput = document.getElementById('tiltAngle');
        this.tiltAngleRange = document.getElementById('tiltAngleRange');
        this.azimuthAngleInput = document.getElementById('azimuthAngle');
        this.azimuthAngleRange = document.getElementById('azimuthAngleRange');
        this.systemLossesInput = document.getElementById('systemLosses');
        this.albedoInput = document.getElementById('albedo');
        
        // Buttons
        this.calculateBtn = document.getElementById('calculateBtn');
        this.getLocationBtn = document.getElementById('getLocation');
        
        // Result elements
        this.annualEnergyOutput = document.getElementById('annualEnergy');
        this.specificYieldOutput = document.getElementById('specificYield');
        this.peakSunHoursOutput = document.getElementById('peakSunHours');
        this.co2OffsetOutput = document.getElementById('co2Offset');
        this.monthlyChart = document.getElementById('monthlyChart');
        this.detailedTableBody = document.getElementById('detailedTableBody');
    }

    bindEvents() {
        // Synchronize range inputs with number inputs
        this.systemSizeRange.addEventListener('input', (e) => {
            this.systemSizeInput.value = e.target.value;
        });
        
        this.systemSizeInput.addEventListener('input', (e) => {
            this.systemSizeRange.value = e.target.value;
        });
        
        this.tiltAngleRange.addEventListener('input', (e) => {
            this.tiltAngleInput.value = e.target.value;
        });
        
        this.tiltAngleInput.addEventListener('input', (e) => {
            this.tiltAngleRange.value = e.target.value;
        });
        
        this.azimuthAngleRange.addEventListener('input', (e) => {
            this.azimuthAngleInput.value = e.target.value;
        });
        
        this.azimuthAngleInput.addEventListener('input', (e) => {
            this.azimuthAngleRange.value = e.target.value;
        });
        
        // Calculate button
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Get location button
        this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        
        // Location autocomplete
        this.locationInput.addEventListener('input', (e) => {
            this.debounce(this.searchLocation.bind(this), 300)(e.target.value);
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        this.getLocationBtn.innerHTML = '<span class="loading"></span> Getting location...';
        this.getLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                this.latitudeInput.value = latitude.toFixed(4);
                this.longitudeInput.value = longitude.toFixed(4);
                
                // Reverse geocoding to get location name
                try {
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();
                    this.locationInput.value = data.city || data.locality || 'Current Location';
                } catch (error) {
                    console.error('Error getting location name:', error);
                    this.locationInput.value = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                }
                
                this.getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                this.getLocationBtn.disabled = false;
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enter coordinates manually.');
                this.getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                this.getLocationBtn.disabled = false;
            }
        );
    }

    async searchLocation(query) {
        if (query.length < 3) return;

        try {
            // Using Nominatim API for location search
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            const data = await response.json();
            
            // For now, we'll just use the first result if user presses Enter
            // In a full implementation, you'd show a dropdown
        } catch (error) {
            console.error('Error searching location:', error);
        }
    }

    async calculate() {
        const params = this.getInputParameters();
        if (!this.validateInputs(params)) return;

        this.calculateBtn.innerHTML = '<span class="loading"></span> Calculating...';
        this.calculateBtn.disabled = true;

        try {
            const meteorologicalData = await this.fetchMeteorologicalData(params.latitude, params.longitude);
            const results = this.performCalculations(params, meteorologicalData);
            this.displayResults(results);
        } catch (error) {
            console.error('Calculation error:', error);
            alert('Error calculating solar potential. Please check your inputs and try again.');
        } finally {
            this.calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Solar Potential';
            this.calculateBtn.disabled = false;
        }
    }

    getInputParameters() {
        return {
            latitude: parseFloat(this.latitudeInput.value),
            longitude: parseFloat(this.longitudeInput.value),
            systemSize: parseFloat(this.systemSizeInput.value),
            panelEfficiency: parseFloat(this.panelEfficiencyInput.value) / 100,
            tiltAngle: parseFloat(this.tiltAngleInput.value),
            azimuthAngle: parseFloat(this.azimuthAngleInput.value),
            systemLosses: parseFloat(this.systemLossesInput.value) / 100,
            albedo: parseFloat(this.albedoInput.value)
        };
    }

    validateInputs(params) {
        const validations = [
            { value: params.latitude, min: -90, max: 90, name: 'Latitude' },
            { value: params.longitude, min: -180, max: 180, name: 'Longitude' },
            { value: params.systemSize, min: 0.1, max: 1000, name: 'System Size' },
            { value: params.panelEfficiency, min: 0.1, max: 0.3, name: 'Panel Efficiency' },
            { value: params.tiltAngle, min: 0, max: 90, name: 'Tilt Angle' },
            { value: params.azimuthAngle, min: -180, max: 180, name: 'Azimuth Angle' },
            { value: params.systemLosses, min: 0, max: 0.5, name: 'System Losses' },
            { value: params.albedo, min: 0, max: 1, name: 'Albedo' }
        ];

        for (const validation of validations) {
            if (isNaN(validation.value) || validation.value < validation.min || validation.value > validation.max) {
                alert(`${validation.name} must be between ${validation.min} and ${validation.max}`);
                return false;
            }
        }

        return true;
    }

    async fetchMeteorologicalData(latitude, longitude) {
        // NASA POWER API parameters
        const parameters = 'ALLSKY_KT,ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,ALLSKY_NKT,ALLSKY_SFC_LW_DWN,T2M,T2M_MIN,T2M_MAX,T2M_RANGE,WS10M,WS10M_MIN,WS10M_MAX';
        const startDate = '2020';
        const endDate = '2022';
        
        const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=${parameters}&community=RE&longitude=${longitude}&latitude=${latitude}&format=JSON&start=${startDate}&end=${endDate}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch meteorological data');
            
            const data = await response.json();
            return this.processMeteorologicalData(data);
        } catch (error) {
            console.error('Error fetching meteorological data:', error);
            // Fallback to typical values if API fails
            return this.getFallbackMeteorologicalData(latitude);
        }
    }

    processMeteorologicalData(data) {
        const properties = data.properties.parameter;
        const monthlyData = [];
        
        for (let month = 1; month <= 12; month++) {
            const monthKey = month.toString().padStart(2, '0');
            monthlyData.push({
                month: month,
                globalHorizontalIrradiance: properties.ALLSKY_SFC_SW_DWN[monthKey] || 0,
                directNormalIrradiance: properties.CLRSKY_SFC_SW_DWN[monthKey] || 0,
                diffuseHorizontalIrradiance: properties.ALLSKY_SFC_SW_DWN[monthKey] * 0.3, // Estimate
                temperature: properties.T2M[monthKey] || 20,
                windSpeed: properties.WS10M[monthKey] || 5
            });
        }
        
        return monthlyData;
    }

    getFallbackMeteorologicalData(latitude) {
        // Typical meteorological data based on latitude
        const isNorthern = latitude >= 0;
        const absLat = Math.abs(latitude);
        
        const baseGHI = Math.max(3, 7 - absLat / 15); // kWh/m²/day
        const seasonalVariation = Math.min(0.5, absLat / 90);
        
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const seasonalFactor = isNorthern ? 
                1 + seasonalVariation * Math.cos((month - 1) * Math.PI / 6) :
                1 + seasonalVariation * Math.cos((month - 7) * Math.PI / 6);
            
            monthlyData.push({
                month: month,
                globalHorizontalIrradiance: baseGHI * seasonalFactor,
                directNormalIrradiance: baseGHI * seasonalFactor * 0.7,
                diffuseHorizontalIrradiance: baseGHI * seasonalFactor * 0.3,
                temperature: 20 + 10 * Math.cos((month - 7) * Math.PI / 6),
                windSpeed: 5
            });
        }
        
        return monthlyData;
    }

    performCalculations(params, meteorologicalData) {
        const monthlyResults = [];
        let annualEnergy = 0;
        
        for (const monthData of meteorologicalData) {
            const result = this.calculateMonthlyEnergy(params, monthData);
            monthlyResults.push(result);
            annualEnergy += result.energyProduction;
        }
        
        const specificYield = annualEnergy / params.systemSize;
        const peakSunHours = annualEnergy / (params.systemSize * 365);
        const co2Offset = annualEnergy * 0.5; // kg CO2 per kWh (grid average)
        
        return {
            annualEnergy: annualEnergy,
            specificYield: specificYield,
            peakSunHours: peakSunHours,
            co2Offset: co2Offset,
            monthlyResults: monthlyResults
        };
    }

    calculateMonthlyEnergy(params, monthData) {
        // Solar position calculations
        const declination = 23.45 * Math.sin(2 * Math.PI * (monthData.month - 81) / 365);
        const hourAngle = 0; // Solar noon
        
        // Solar elevation angle
        const elevation = Math.asin(
            Math.sin(params.latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
            Math.cos(params.latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle)
        ) * 180 / Math.PI;
        
        // Incident angle modifier
        const incidentAngle = Math.acos(
            Math.sin(elevation * Math.PI / 180) * Math.sin(params.tiltAngle * Math.PI / 180) +
            Math.cos(elevation * Math.PI / 180) * Math.cos(params.tiltAngle * Math.PI / 180) * 
            Math.cos((params.azimuthAngle - 180) * Math.PI / 180)
        );
        
        const incidentModifier = Math.max(0, Math.cos(incidentAngle));
        
        // Plane of array irradiance
        const poaIrradiance = monthData.globalHorizontalIrradiance * incidentModifier;
        
        // Temperature correction
        const tempCorrection = 1 - 0.004 * (monthData.temperature - 25);
        
        // Energy calculation
        const dcEnergy = poaIrradiance * params.systemSize * 1000 * params.panelEfficiency * tempCorrection / 1000;
        const acEnergy = dcEnergy * (1 - params.systemLosses);
        
        return {
            month: monthData.month,
            globalHorizontalIrradiance: monthData.globalHorizontalIrradiance,
            directNormalIrradiance: monthData.directNormalIrradiance,
            diffuseHorizontalIrradiance: monthData.diffuseHorizontalIrradiance,
            energyProduction: acEnergy * 30 // Monthly energy
        };
    }

    displayResults(results) {
        // Update summary results
        this.annualEnergyOutput.textContent = results.annualEnergy.toFixed(0);
        this.specificYieldOutput.textContent = results.specificYield.toFixed(0);
        this.peakSunHoursOutput.textContent = results.peakSunHours.toFixed(1);
        this.co2OffsetOutput.textContent = results.co2Offset.toFixed(0);
        
        // Update monthly chart
        this.updateMonthlyChart(results.monthlyResults);
        
        // Update detailed table
        this.updateDetailedTable(results.monthlyResults);
    }

    updateMonthlyChart(monthlyResults) {
        const ctx = this.monthlyChart.getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Energy Production (kWh)',
                    data: monthlyResults.map(r => r.energyProduction),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Energy (kWh)'
                        }
                    }
                }
            }
        });
    }

    updateDetailedTable(monthlyResults) {
        this.detailedTableBody.innerHTML = '';
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        monthlyResults.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${monthNames[result.month - 1]}</td>
                <td>${result.globalHorizontalIrradiance.toFixed(2)} kWh/m²/day</td>
                <td>${result.directNormalIrradiance.toFixed(2)} kWh/m²/day</td>
                <td>${result.diffuseHorizontalIrradiance.toFixed(2)} kWh/m²/day</td>
                <td>${result.energyProduction.toFixed(0)} kWh</td>
            `;
            this.detailedTableBody.appendChild(row);
        });
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SolarCalculator();
});
