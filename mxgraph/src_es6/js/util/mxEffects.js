/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
const mxEffects =
{

	/**
	 * Class: mxEffects
	 * 
	 * Provides animation effects.
	 */

	/**
	 * Function: animateChanges
	 * 
	 * Asynchronous animated move operation. See also: <mxMorphing>.
	 * 
	 * Example:
	 * 
	 * (code)
	 * graph.model.addListener(mxEvent.CHANGE, function(sender, evt)
	 * {
	 *   var changes = evt.getProperty('edit').changes;
	 * 
	 *   if (changes.length < 10)
	 *   {
	 *     mxEffects.animateChanges(graph, changes);
	 *   }
	 * });
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> that received the changes.
	 * changes - Array of changes to be animated.
	 * done - Optional function argument that is invoked after the
	 * last step of the animation.
	 */
	animateChanges: function(graph, changes, done)
	{
		const maxStep = 10;
		let step = 0;

		const animate = () => {
			let isRequired = false;
			
			for (let i = 0; i < changes.length; i++)
			{
				const change = changes[i];
				
				if (change instanceof mxGeometryChange ||
					change instanceof mxTerminalChange ||
					change instanceof mxValueChange ||
					change instanceof mxChildChange ||
					change instanceof mxStyleChange)
				{
					const state = graph.getView().getState(change.cell || change.child, false);
					
					if (state != null)
					{
						isRequired = true;
					
						if (change.constructor != mxGeometryChange || graph.model.isEdge(change.cell))
						{
							mxUtils.setOpacity(state.shape.node, 100 * step / maxStep);
						}
						else
						{
							const scale = graph.getView().scale;					

							const dx = (change.geometry.x - change.previous.x) * scale;
							const dy = (change.geometry.y - change.previous.y) * scale;
							
							const sx = (change.geometry.width - change.previous.width) * scale;
							const sy = (change.geometry.height - change.previous.height) * scale;
							
							if (step == 0)
							{
								state.x -= dx;
								state.y -= dy;
								state.width -= sx;
								state.height -= sy;
							}
							else
							{
								state.x += dx / maxStep;
								state.y += dy / maxStep;
								state.width += sx / maxStep;
								state.height += sy / maxStep;
							}
							
							graph.cellRenderer.redraw(state);
							
							// Fades all connected edges and children
							mxEffects.cascadeOpacity(graph, change.cell, 100 * step / maxStep);
						}
					}
				}
			}

			if (step < maxStep && isRequired)
			{
				step++;
				window.setTimeout(animate, delay);
			}
			else if (done != null)
			{
				done();
			}
		};
		
		var delay = 30;
		animate();
	},
    
	/**
	 * Function: cascadeOpacity
	 * 
	 * Sets the opacity on the given cell and its descendants.
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> that contains the cells.
	 * cell - <mxCell> to set the opacity for.
	 * opacity - New value for the opacity in %.
	 */
    cascadeOpacity: function(graph, cell, opacity)
	{
		// Fades all children
		const childCount = graph.model.getChildCount(cell);
		
		for (var i=0; i<childCount; i++)
		{
			const child = graph.model.getChildAt(cell, i);
			const childState = graph.getView().getState(child);
			
			if (childState != null)
			{
				mxUtils.setOpacity(childState.shape.node, opacity);
				mxEffects.cascadeOpacity(graph, child, opacity);
			}
		}
		
		// Fades all connected edges
		const edges = graph.model.getEdges(cell);
		
		if (edges != null)
		{
			for (var i=0; i<edges.length; i++)
			{
				const edgeState = graph.getView().getState(edges[i]);
				
				if (edgeState != null)
				{
					mxUtils.setOpacity(edgeState.shape.node, opacity);
				}
			}
		}
	},

	/**
	 * Function: fadeOut
	 * 
	 * Asynchronous fade-out operation.
	 */
	fadeOut: function(node, from, remove, step, delay, isEnabled)
	{
		step = step || 40;
		delay = delay || 30;
		
		let opacity = from || 100;
		
		mxUtils.setOpacity(node, opacity);
		
		if (isEnabled || isEnabled == null)
		{
			const f = () => {
			    opacity = Math.max(opacity-step, 0);
				mxUtils.setOpacity(node, opacity);
				
				if (opacity > 0)
				{
					window.setTimeout(f, delay);
				}
				else
				{
					node.style.visibility = 'hidden';
					
					if (remove && node.parentNode)
					{
						node.parentNode.removeChild(node);
					}
				}
			};
			window.setTimeout(f, delay);
		}
		else
		{
			node.style.visibility = 'hidden';
			
			if (remove && node.parentNode)
			{
				node.parentNode.removeChild(node);
			}
		}
	}

};
