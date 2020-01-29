<template>
	<div class="button-favorite">
		<button class="circular ui icon button" :class="{ favorite: toggled }">
			<i class="icon star"></i>
		</button>
	</div>
</template>

<script>
export default {
	name: 'NeuronFavorite',
	props: [ 'toggled' ]
}
</script>

<style lang="less">
.button-favorite {
	.ui.button.favorite {
		background-color: darkorange !important;
		color: white !important;
	}
}
</style>
