package controller;

import model.Customer;
import model.Province;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;
import service.customer.CustomerService;
import service.provice.ProvinceService;

@Controller
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/provinces")
    public ModelAndView listProvinces(){
        Iterable<Province> provinces = provinceService.findAll();
        ModelAndView modelAndView = new ModelAndView("/province/list");
        modelAndView.addObject("provinces", provinces);
        return modelAndView;
    }

    @GetMapping("/create-province")
    public ModelAndView showCreateForm(){
        ModelAndView modelAndView = new ModelAndView("/province/create");
        modelAndView.addObject("province", new Province());
        return modelAndView;
    }

    @PostMapping("/create-province")
    public ModelAndView saveProvince(@ModelAttribute("province") Province province){
        provinceService.save(province);

        ModelAndView modelAndView = new ModelAndView("/province/create");
        modelAndView.addObject("province", new Province());
        modelAndView.addObject("message", "New province created successfully");
        return modelAndView;
    }

    @GetMapping("/edit-province/{id}")
    public ModelAndView showEditForm(@PathVariable Long id){
        Province province = provinceService.findById(id);
        ModelAndView modelAndView;
        if(province != null) {
            modelAndView = new ModelAndView("/province/update");
            modelAndView.addObject("province", province);

        }else {
            modelAndView = new ModelAndView("/error/index");
        }
        return modelAndView;
    }

    @PostMapping("/edit-province")
    public ModelAndView updateProvince(@ModelAttribute("province") Province province){
        provinceService.save(province);
        ModelAndView modelAndView = new ModelAndView("/province/update");
        modelAndView.addObject("province", province);
        modelAndView.addObject("message", "Province updated successfully");
        return modelAndView;
    }

    @GetMapping("/delete-province/{id}")
    public ModelAndView showDeleteForm(@PathVariable Long id){
        Province province = provinceService.findById(id);
        if(province != null) {
            provinceService.remove(province.getId());
            Iterable<Province> provinces = provinceService.findAll();
            ModelAndView modelAndView = new ModelAndView("/province/list");
            modelAndView.addObject("provinces", provinces);
            return modelAndView;
        }else {
            ModelAndView modelAndView = new ModelAndView("/error/index.html");
            return modelAndView;
        }
    }

    @GetMapping("/view-province/{id}")
    public ModelAndView viewProvince(@PathVariable("id") Long id){
        Province province = provinceService.findById(id);
        if(province == null){
            return new ModelAndView("/error.404");
        }

        Iterable<Customer> customers = customerService.findAllByProvince(province);

        ModelAndView modelAndView = new ModelAndView("/province/detail");
        modelAndView.addObject("province", province);
        modelAndView.addObject("customers", customers);
        return modelAndView;
    }


}