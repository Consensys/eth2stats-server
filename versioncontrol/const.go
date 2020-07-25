package versioncontrol

var VersionStatus = struct {
	Unknown, Ok, Outdated string
}{
	Unknown:  "unknown",
	Ok:       "ok",
	Outdated: "outdated",
}
