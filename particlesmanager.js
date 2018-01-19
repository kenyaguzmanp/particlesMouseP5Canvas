import Soundwave from 'component/Soundwave';
import Particles from 'component/Particles';

export default {
	name: 'Particlesmanager',
	// declare the props
	props: ['shouldAutoplay'],
	// like data, the prop can be used inside templates and is also made available in the vm as this.shouldAutoplay
	components: {
		Soundwave,
		Particles,
	},
	data() {
		return {
			selected: null,
			end: null,
			repeat: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			// Code that will run only after the entire view has been rendered
		});
	},
	beforeDestroy() {},
	methods: {
		handleSelect(ptc) {
			// console.log(`handling select particle`);
			this.selected = ptc;
		},
		handleSoundEnded(soundended) {
			// console.log(`handling ended sound`);
			this.end = soundended;
			// console.log(this.end);
		},
		handleSelect2(repeat) {
			console.log(`handling select2`);
			this.repeat = repeat;
		},
	},
};
