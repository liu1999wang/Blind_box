<template>
<view class="container" :class="theme">
		<!-- {{html}} -->
	<parser :html="html"></parser>
	<!-- {{content.content}} -->
	<!-- <u-parse v-html="content.content"></view> -->
	<!-- <u-parse :content="content.content"></u-parse> -->
</view>
</template>

<script>
import parser from "@/components/jyf-Parser/index"
export default {
  data() {
    return {
	};
  },
  components: {
	  parser
  },
  props: {
    html: {
      type: String
    },
	theme: {
		type: String,
		default: () => {
			return 'black'
		}
	}
  },
  watch: {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
// @import "./richtext.css";
.container {
	// color: white;
	/* color: red; */
	
	// &.white {
	// 	color: #121212;
	// }
}
</style>