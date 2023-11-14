'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    dateOptions = {
        day: "2-digit",
        month: "long",
    };
    formattedDate = new Intl.DateTimeFormat("en-US", this.dateOptions).format(this.date);
    id = Date.now().toString().slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription() {
        this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${this.formattedDate}`;
        return this.description;
    }
}

class Running extends Workout {
    type = 'running'

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = "cycling"

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class App {
    #map;
    #mapEvent;
    #mapZoomLevel = 13;
    #workouts = [];

    constructor() {
        this._getPosition();
        form.addEventListener("submit", this._newWorkout.bind(this));
        inputType.addEventListener("change", this._toggleElevationField);
        containerWorkouts.addEventListener("click", this._moveToPoint.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
            alert("Couldn't get your position")
        });
    }

    _loadMap(position) {
        const { latitude, longitude } = position.coords;

        this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);

        L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        this.#map.on("click", this._showForm.bind(this));
        this._getLocalStorage();
    }

    _showForm(event) {
        this.#mapEvent = event;
        form.classList.remove("hidden");
        inputDistance.focus();
    }

    _hideForm() {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        form.style.display = "none";
        form.classList.add("hidden");
        setTimeout(() => form.style.display = "grid", 1000);
    }

    _toggleElevationField() {
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    }

    _newWorkout(e) {
        e.preventDefault();

        const validInputs = (...inputs) => inputs.every((input) => Number.isFinite(input));
        const allPositive = (...inputs) => inputs.every((input) => input > 0);

        const {lat, lng} = this.#mapEvent.latlng;
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        let workout;

        if (type === "running") {
            const cadence = +inputCadence.value;
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) return alert("It has to be a positive number");
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        if (type === "cycling") {
            const elevationGain = +inputElevation.value;
            if (!validInputs(distance, duration, elevationGain) || !allPositive(distance, duration)) return alert("It has to be a positive number");
            workout = new Cycling([lat, lng], distance, duration, elevationGain);
        }

        this.#workouts.push(workout);
        this._renderWorkoutMarker(workout);
        this._renderWorkout(workout);
        this._hideForm();
        this._setLocalStorage();
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(
            L.popup({ 
                maxWidth: 250, 
                maxHeight: 100, 
                autoClose: false, 
                closeOnClick: false, 
                className: `leaflet-popup ${workout.type}-popup`
            })
        )
        .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`)
        .openPopup();
    }

    _renderWorkout(workout) {
        const html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.type === "running" ? workout.pace.toFixed(1) : workout.speed}</span>
            <span class="workout__unit">${workout.type === "running" ? "min/km" : "km/h"}</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === "running" ? "🦶🏼" : "⛰"}</span>
            <span class="workout__value">${workout.type === "running" ? workout.cadence : workout.elevationGain}</span>
            <span class="workout__unit">${workout.type === "running" ? "spm" : "m"}</span>
          </div>
        </li>
        `;

        form.insertAdjacentHTML("afterend", html);
    }

    _moveToPoint(e) {
        const workoutEl = e.target.closest(".workout");

        if (!workoutEl) return;

        const workout = this.#workouts.find((workout) => workout.id === workoutEl.dataset.id);
        this.#map.setView(workout.coords, this.#mapZoomLevel, { animate: true, pan: { duration: 1 } });
    }

    _setLocalStorage() {
        localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem("workouts")).map((workout) => workout.type === "running" ? Object.assign(new Running(), workout) : Object.assign(new Cycling(), workout));

        if (!data) return;

        this.#workouts = data;
        
        this.#workouts.forEach((workout) => {
            this._renderWorkoutMarker(workout);
            this._renderWorkout(workout);
        });
    }

    reset() {
        localStorage.removeItem("worlouts");
        location.reload();
    }
}

const app = new App();