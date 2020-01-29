<template>
   <div id="app">
      <div class="tab-bar">
				<div class="tab">
					<div class="icon-tab">
						<i class="icon" :class="$route.meta.icon"></i>
					</div>
					<span class="tab-title">{{ $route.meta.title }}</span>
					<div class="close-tab-button">
						<button class="ui icon button">
							<i class="icon close icon"></i>
						</button>
					</div>
				</div>
			</div>
      <router-view />
   </div>
</template>

<script>

 export default {
   name: 'app',
    data: function () {
    return {
        v4: this.$uuid.v4()
    };
  }
 };
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
	background-color: white;

	.tab-bar {
		display: flex;
		height: 40px;
		width: 100%;
		background: #7fa3ff;

		.tab {
			display: grid;
			grid-template-columns: 40px 1fr 40px;
			background: #f8f8f8;
			align-items: center;
			border-top-right-radius: 20px;

			.icon-tab {
				color: #6256f3;
				font-size: 15px;
			}

			.tab-title {
				margin-right: 10px;
				font-size: 16px;
			}

			.close-tab-button {

				button {
					background: none;
				}
			}
		}
	}
}
</style>
