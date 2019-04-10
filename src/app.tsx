import Vue from "vue";
import Component from "vue-class-component";
import style from "./test.module.scss";
@Component({
  style,
})
export default class App extends Vue {
  get loading() {
    return false;
  }
  render(h) {
    return (
      <div class="selector" id="app">
        TEST
      </div>
    );
  }
}
