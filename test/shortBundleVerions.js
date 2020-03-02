import { getCFBundleShortVersionString } from '../';
import test from "ava";

test(
	"CFBundleShortVersionString basic",
	t => {
		const v = getCFBundleShortVersionString('1.2.3');
		t.is(v, '1.2.3');
	}
);

test(
	"CFBundleShortVersionString alpha",
	t => {
		const v = getCFBundleShortVersionString('1.2.3-alpha');
		t.is(v, '1.2.3');
	}
);

test(
	"CFBundleShortVersionString alpha point",
	t => {
		const v = getCFBundleShortVersionString('1.2.3-alpha.0');
		t.is(v, '1.2.3');
	}
);

test(
	"CFBundleShortVersionString dash number",
	t => {
		const v = getCFBundleShortVersionString('1.2.3-0');
		t.is(v, '1.2.3');
	}
);

test(
	"CFBundleShortVersionString extra dot",
	t => {
		const v = getCFBundleShortVersionString('1.2.3.0');
		t.is(v, '1.2.3');
	}
);

test(
	"CFBundleShortVersionString garbage in, garbage out",
	t => {
		const v = getCFBundleShortVersionString('garbage');
		t.is(v, 'garbage');
	}
);
