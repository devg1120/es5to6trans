/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxLayoutManager
 * 
 * Implements a layout manager that runs a given layout after any changes to the graph:
 * 
 * Example:
 * 
 * (code)
 * var layoutMgr = new mxLayoutManager(graph);
 * layoutMgr.getLayout = function(cell)
 * {
 *   return layout;
 * };
 * (end)
 * 
 * Event: mxEvent.LAYOUT_CELLS
 * 
 * Fires between begin- and endUpdate after all cells have been layouted in
 * <layoutCells>. The <code>cells</code> property contains all cells that have
 * been passed to <layoutCells>.
 * 
 * Constructor: mxLayoutManager
 *
 * Constructs a new automatic layout for the given graph.
 *
 * Arguments:
 * 
 * graph - Reference to the enclosing graph. 
 */
class mxLayoutManager extends mxEventSource {
    constructor(graph) {
        // Executes the layout before the changes are dispatched
        this.undoHandler = mxUtils.bind(this, function(sender, evt)
        {
            if (this.isEnabled())
            {
                this.beforeUndo(evt.getProperty('edit'));
            }
        });
        
        // Notifies the layout of a move operation inside a parent
        this.moveHandler = mxUtils.bind(this, function(sender, evt)
        {
            if (this.isEnabled())
            {
                this.cellsMoved(evt.getProperty('cells'), evt.getProperty('event'));
            }
        });
        
        this.setGraph(graph);
    }

    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation
     * returns <enabled>.
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation
     * updates <enabled>.
     * 
     * Parameters:
     * 
     * enabled - Boolean that specifies the new enabled state.
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Function: isBubbling
     * 
     * Returns true if a layout should bubble, that is, if the parent layout
     * should be executed whenever a cell layout (layout of the children of
     * a cell) has been executed. This implementation returns <bubbling>.
     */
    isBubbling() {
        return this.bubbling;
    }

    /**
     * Function: setBubbling
     * 
     * Sets <bubbling>.
     */
    setBubbling(value) {
        this.bubbling = value;
    }

    /**
     * Function: getGraph
     * 
     * Returns the graph that this layout operates on.
     */
    getGraph() {
        return this.graph;
    }

    /**
     * Function: setGraph
     * 
     * Sets the graph that the layouts operate on.
     */
    setGraph(graph) {
        if (this.graph != null)
        {
            var model = this.graph.getModel();		
            model.removeListener(this.undoHandler);
            this.graph.removeListener(this.moveHandler);
        }
        
        this.graph = graph;
        
        if (this.graph != null)
        {
            var model = this.graph.getModel();	
            model.addListener(mxEvent.BEFORE_UNDO, this.undoHandler);
            this.graph.addListener(mxEvent.MOVE_CELLS, this.moveHandler);
        }
    }

    /**
     * Function: getLayout
     * 
     * Returns the layout to be executed for the given graph and parent.
     */
    getLayout(parent) {
        return null;
    }

    /**
     * Function: beforeUndo
     * 
     * Called from the undoHandler.
     *
     * Parameters:
     * 
     * cell - Array of <mxCells> that have been moved.
     * evt - Mouse event that represents the mousedown.
     */
    beforeUndo(undoableEdit) {
        let cells = this.getCellsForChanges(undoableEdit.changes);
        const model = this.getGraph().getModel();

        // Adds all descendants
        let tmp = [];
        
        for (let i = 0; i < cells.length; i++)
        {
            tmp = tmp.concat(model.getDescendants(cells[i]));
        }
        
        cells = tmp;
        
        // Adds all parent ancestors
        if (this.isBubbling())
        {
            tmp = model.getParents(cells);
            
            while (tmp.length > 0)
            {
                cells = cells.concat(tmp);
                tmp = model.getParents(tmp);
            }
        }
        
        this.executeLayoutForCells(cells);
    }

    /**
     * Function: executeLayout
     * 
     * Executes the given layout on the given parent.
     */
    executeLayoutForCells(cells) {
        // Adds reverse to this array to avoid duplicate execution of leafes
        // Works like capture/bubble for events, first executes all layout
        // from top to bottom and in reverse order and removes duplicates.
        let sorted = mxUtils.sortCells(cells, true);
        sorted = sorted.concat(sorted.slice().reverse());
        this.layoutCells(sorted);
    }

    /**
     * Function: cellsMoved
     * 
     * Called from the moveHandler.
     *
     * Parameters:
     * 
     * cell - Array of <mxCells> that have been moved.
     * evt - Mouse event that represents the mousedown.
     */
    cellsMoved(cells, evt) {
        if (cells != null && evt != null)
        {
            const point = mxUtils.convertPoint(this.getGraph().container,
                mxEvent.getClientX(evt), mxEvent.getClientY(evt));
            const model = this.getGraph().getModel();
            
            // Checks if a layout exists to take care of the moving if the
            // parent itself is not being moved
            for (let i = 0; i < cells.length; i++)
            {
                const parent = model.getParent(cells[i]);
                
                if (mxUtils.indexOf(cells, parent) < 0)
                {
                    const layout = this.getLayout(parent);
        
                    if (layout != null)
                    {
                        layout.moveCell(cells[i], point.x, point.y);
                    }
                }
            }
        }
    }

    /**
     * Function: getCellsForEdit
     * 
     * Returns the cells to be layouted for the given sequence of changes.
     */
    getCellsForChanges(changes) {
        const dict = new mxDictionary();
        const result = [];
        
        for (let i = 0; i < changes.length; i++)
        {
            const change = changes[i];
            
            if (change instanceof mxRootChange)
            {
                return [];
            }
            else
            {
                const cells = this.getCellsForChange(change);
                
                for (let j = 0; j < cells.length; j++)
                {
                    if (cells[j] != null && !dict.get(cells[j]))
                    {
                        dict.put(cells[j], true);
                        result.push(cells[j]);
                    }
                }
            }
        }
        
        return result;
    }

    /**
     * Function: getCellsForChange
     * 
     * Executes all layouts which have been scheduled during the
     * changes.
     */
    getCellsForChange(change) {
        const model = this.getGraph().getModel();
        
        if (change instanceof mxChildChange)
        {
            return [change.child, change.previous, model.getParent(change.child)];
        }
        else if (change instanceof mxTerminalChange || change instanceof mxGeometryChange)
        {
            return [change.cell, model.getParent(change.cell)];
        }
        else if (change instanceof mxVisibleChange || change instanceof mxStyleChange)
        {
            return [change.cell];
        }
        
        return [];
    }

    /**
     * Function: layoutCells
     * 
     * Executes all layouts which have been scheduled during the
     * changes.
     */
    layoutCells(cells) {
        if (cells.length > 0)
        {
            // Invokes the layouts while removing duplicates
            const model = this.getGraph().getModel();
            
            model.beginUpdate();
            try 
            {
                let last = null;
                
                for (let i = 0; i < cells.length; i++)
                {
                    if (cells[i] != model.getRoot() && cells[i] != last)
                    {
                        if (this.executeLayout(this.getLayout(cells[i]), cells[i]))
                        {
                            last = cells[i];
                        }
                    }
                }
                
                this.fireEvent(new mxEventObject(mxEvent.LAYOUT_CELLS, 'cells', cells));
            }
            finally
            {
                model.endUpdate();
            }
        }
    }

    /**
     * Function: executeLayout
     * 
     * Executes the given layout on the given parent.
     */
    executeLayout(layout, parent) {
        let result = false;
        
        if (layout != null && parent != null)
        {
            layout.execute(parent);
            result = true;
        }
        
        return result;
    }

    /**
     * Function: destroy
     * 
     * Removes all handlers from the <graph> and deletes the reference to it.
     */
    destroy() {
        this.setGraph(null);
    }
}

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxLayoutManager.prototype.graph = null;

/**
 * Variable: bubbling
 * 
 * Specifies if the layout should bubble along
 * the cell hierarchy. Default is true.
 */
mxLayoutManager.prototype.bubbling = true;

/**
 * Variable: enabled
 * 
 * Specifies if event handling is enabled. Default is true.
 */
mxLayoutManager.prototype.enabled = true;

/**
 * Variable: updateHandler
 * 
 * Holds the function that handles the endUpdate event.
 */
mxLayoutManager.prototype.updateHandler = null;

/**
 * Variable: moveHandler
 * 
 * Holds the function that handles the move event.
 */
mxLayoutManager.prototype.moveHandler = null;
