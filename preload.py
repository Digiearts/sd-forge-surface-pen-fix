from modules import scripts
import gradio as gr

class SurfacePenFixExtension(scripts.Script):
    def title(self):
        return "Surface Pen Fix"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return []

    def after_component(self, component, **kwargs):
        # Add our script to any canvas component
        if hasattr(component, 'elem_id') and 'forge_mixin' in str(component.elem_id):
            component.script = """
                <script type="text/javascript" src="file=extensions/forge_surface_pen_fix/scripts/surface-pen-fix.js"></script>
            """