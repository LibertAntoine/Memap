<template>
	<div>
		<button class="circular ui icon button" :class="{ selected: toggled }">
			<i class="icon thumbtack"></i>
		</button>
	</div>
</template>

<script>
export default {
	name: 'NeuronPin',
	props: [ 'toggled' ]
}
</script>
