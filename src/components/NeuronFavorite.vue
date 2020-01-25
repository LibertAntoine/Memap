<template>
	<div>
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
.ui.button.favorite {
	background-color: darkorange;
	color: white;
}
</style>
