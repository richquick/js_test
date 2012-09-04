describe('jQuery:', function() {
    it('Checks that jQuery exists as a function', function() {
        expect(typeof jQuery).toEqual('function');
    });
});

describe('ac_web:', function() {
    it('Checks that ac_web exists as an object', function() {
        expect(typeof ac_web).toEqual('object');
    });
});

describe('Init:', function() {
    it('Checks that function Init() exists as a function', function() {
        expect(typeof Init).toEqual('function');
    });
});

describe('Quick Link:', function() {
    it('Checks that function InitQuickLink() exists', function() {
        expect(typeof InitQuickLink).toEqual('function');
    });
});

describe('Tool Tip:', function() {
	var tool_tip;

	beforeEach(function() {
		tool_tip = new ac_web.ToolTip();
    });

    it('Checks that function InitToolTip() exists', function() {
        expect(typeof InitToolTip).toEqual('function');
    });

	it('Checks ToolTip object is created', function() {
		expect(tool_tip).not.toEqual(null);
	});
	
	it('Checks ToolTip object has the default title', function() {
		expect(tool_tip.get('title')).toEqual('this is a tool tip');
	});

	it('Checks ToolTip object \'title\' property can be set', function() {
		tool_tip.set({'title': 'a test title'});
		expect(tool_tip.get('title')).toEqual('a test title');
	});
});

describe('Slider:', function() {
    it('Checks that function InitSlider() exists', function() {
        expect(typeof InitSlider).toEqual('function');
    });

    it('Checks that function ShowSliderBanner() exists', function() {
        expect(typeof ShowSliderBanner).toEqual('cat');
    });
});

describe('Anchor Scroll:', function() {
    it('Checks that function InitAnchorScroll() exists', function() {
        expect(typeof InitAnchorScroll).toEqual('function');
    });
});

describe('Date Picker:', function() {
    it('Checks that function InitDatePicker() exists', function() {
        expect(typeof InitDatePicker).toEqual('function');
    });
});

describe('Tabs:', function() {
    it('Checks that function InitTab() exists', function() {
        expect(typeof InitTab).toEqual('function');
    });
});

describe('Captions:', function() {
    it('Checks that function InitCaption() exists', function() {
        expect(typeof InitCaption).toEqual('cat');
    });
});

describe('Accordions:', function() {
    it('Checks that function InitAccordion() exists', function() {
        expect(typeof InitAccordion).toEqual('function');
    });
});

describe('Dropdown:', function() {
    it('Checks that function InitDropdown() exists', function() {
        expect(typeof InitDropdown).toEqual('function');
    });
});