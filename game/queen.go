package game

// NewQueen returns a reference to the new queen
// with references to the position and command passed in the argument
func NewQueen(pos *Position, t *Team) *Queen {
	q := &Queen{}
	q.figurer = q
	q.SetName("queen")
	q.Position = pos
	q.SetTeam(t)
	return q
}

// Queen is data type of chess figure
type Queen struct {
	Figure
}

// GetBrokenFields return a slice of BrokenFields with broken fields
func (q *Queen) GetBrokenFields() *BrokenFields {
	opened := map[Direction]bool{
		top:         true,
		topRight:    true,
		right:       true,
		rightBottom: true,
		bottom:      true,
		bottomLeft:  true,
		left:        true,
		leftTop:     true,
	}
	return q.GetBrokenFieldsByDirectionsAndMaxRemote(opened, 7)
}

// CanWalkLikeThat returns true if the queen's move matches the rules for how she moves, otherwise returns false
// this method does not check if the king hit the beaten field after it has been committed
func (q *Queen) CanWalkLikeThat(pos *Position) bool {
	if (q.X == pos.X || q.Y == pos.Y) ||
		(pos.X < q.X && pos.Y < q.Y && q.X-pos.X == q.Y-pos.Y) ||
		(pos.X < q.X && pos.Y > q.Y && q.X-pos.X == pos.Y-q.Y) ||
		(pos.X > q.X && pos.Y < q.Y && pos.X-q.X == q.Y-pos.Y) ||
		(pos.X > q.X && pos.Y > q.Y && pos.X-q.X == pos.Y-q.Y) {
		return true
	}
	return false
}
