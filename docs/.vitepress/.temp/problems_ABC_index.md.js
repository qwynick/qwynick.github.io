import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ABC 题解目录","description":"","frontmatter":{"title":"ABC 题解目录"},"headers":[],"relativePath":"problems/ABC/index.md","filePath":"problems/ABC/index.md"}');
const _sfc_main = { name: "problems/ABC/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ABCIndex = resolveComponent("ABCIndex");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="atcoder-beginner-contest-abc" tabindex="-1">AtCoder Beginner Contest（ABC） <a class="header-anchor" href="#atcoder-beginner-contest-abc" aria-label="Permalink to &quot;AtCoder Beginner Contest（ABC）&quot;">​</a></h1><p>这里收录 ABC 系列题解。</p>`);
  _push(ssrRenderComponent(_component_ABCIndex, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("problems/ABC/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
