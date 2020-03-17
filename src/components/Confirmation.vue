<template>
  <div>
  	<b-alert
  		variant="success"
  		dismissible
  		fade
  		:show="showDismissibleAlert"
  		@dismissed="showDismissibleAlert=false"
  	>
  		{{ message }}
  	</b-alert>
  	<button v-if="showDismissibleAlert==false" type="button"
  		class="btn btn-danger btn-sm align-left d-block"
  		@click=="showDismissibleAlert=true">
  		Показать алерт
  	</button>
  </div>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      showDismissibleAlert: true,
    };
  },
};
</script>

}
