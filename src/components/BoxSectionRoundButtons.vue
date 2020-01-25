<template>
	<div class="box-section-round-buttons">
		<div class="button-align-left">
			<slot name="alignleft"></slot>
		</div>
		<div class="button-align-right">
			<slot name="alignright"></slot>
		</div>
	</div>
</template>

<script>
//import RoundButton from './RoundButton'

export default {
	name: 'BoxSectionRoundButtons',
	components: {
	}
}
</script>
